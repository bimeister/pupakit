import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { DndItemHtmlElement } from '../../declarations/interfaces/dnd-item-html-element.interface';
import { DndService } from '../../services/dnd.service';
import { filterByInstanceOf, isNil } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { DndDropData } from '../../declarations/interfaces/dnd-drop-data.interface';
import { DndMoveData } from '../../declarations/interfaces/dnd-move-data.interface';
import { getDndTargetItemFromEvent } from '../../declarations/functions/get-dnd-target-item-from-event.function';
import { DndItemConfig } from '../../declarations/interfaces/dnd-item-config.interface';
import { DndDropPosition } from '../../declarations/types/dnd-drop-position.type';
import { DndItem } from '../../declarations/interfaces/dnd-item.interface';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { DndItemRegistryService } from '../../services/dnd-item-registry.service';
import { DndEvents } from '../../declarations/events/dnd.events';
import { DND_HOST_ID_ATTRIBUTE } from '../../declarations/constants/dnd-host-id-attribute.const';

const DND_POSITION_PERCENT: number = 0.2;
const DND_CLONE_OFFSET_PX: number = 4;

@Component({
  selector: 'pupa-dnd-host',
  templateUrl: './dnd-host.component.html',
  styleUrls: ['./dnd-host.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DndItemRegistryService],
})
export class DndHostComponent<Source = unknown, Target = unknown> implements OnChanges, OnInit, OnDestroy {
  @Input() public dndHostId: string;
  @Input() public isDraggable: boolean = true;
  @Input() public dndItemsDirection: 'row' | 'column' = 'column';
  @Input() public dndCloneItemsOffset: number = DND_CLONE_OFFSET_PX;

  @Input() public sourceType: Source;
  @Input() public targetType: Target;

  @Output() public readonly dndMove: EventEmitter<DndMoveData<Source, Target>> = new EventEmitter<
    DndMoveData<Source, Target>
  >();
  @Output() public readonly dndDrop: EventEmitter<DndDropData<Source, Target>> = new EventEmitter<
    DndDropData<Source, Target>
  >();

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);

  private readonly selectedDndItemIds: Set<string> = new Set<string>();

  private readonly subscription: Subscription = new Subscription();

  private listeningIsStarted: boolean = false;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly dndService: DndService,
    private readonly injector: Injector,
    private readonly renderer: Renderer2,
    private readonly dndItemsRegistryService: DndItemRegistryService
  ) {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
    this.hammerManager.add(new Hammer.Tap());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDraggableChanges(changes.isDraggable);
  }

  public ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, DND_HOST_ID_ATTRIBUTE, this.dndHostId);

    if (this.isDraggable) {
      this.initListeners();
    }
  }

  public ngOnDestroy(): void {
    this.clearListeners();
  }

  public getHostId(): string {
    return this.dndHostId;
  }

  public getSelectedDndItemConfigs(): DndItemConfig[] {
    return Array.from(this.selectedDndItemIds)
      .map((selectedDndItemId: string) => this.dndItemsRegistryService.getDndItemConfig(selectedDndItemId))
      .filter((dndItemConfig: DndItemConfig) => dndItemConfig.canBeMoved(dndItemConfig.dndItem));
  }

  public clearSelectedDndItems(): void {
    this.selectedDndItemIds.clear();
  }

  private processDraggableChanges(isDraggableChange?: ComponentChange<this, boolean>): void {
    if (isNil(isDraggableChange?.currentValue)) {
      return;
    }

    const isDraggable: boolean = isDraggableChange.currentValue;
    isDraggable ? this.initListeners() : this.clearListeners();
  }

  private initListeners(): void {
    if (this.listeningIsStarted) {
      return;
    }

    this.hammerManager.on('tap', (event: HammerInput) => this.processTap(event));
    this.hammerManager.on('panstart', (event: HammerInput) => this.processPanStart(event));

    this.subscription.add(this.processDndMove());
    this.subscription.add(this.processDndDrop());

    this.listeningIsStarted = true;
  }

  private clearListeners(): void {
    this.hammerManager.destroy();
    this.subscription.unsubscribe();
    this.listeningIsStarted = false;
  }

  private processTap(event: HammerInput): void {
    const targetItem: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);
    if (isNil(targetItem) || !event.srcEvent.shiftKey) {
      return;
    }

    this.selectedDndItemIds.add(targetItem.dataset.dndItemId);
  }

  private processPanStart(event: HammerInput): void {
    const targetItem: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);
    if (isNil(targetItem) || !(event.srcEvent instanceof PointerEvent)) {
      return;
    }

    const targetItemConfig: DndItemConfig = this.dndItemsRegistryService.getDndItemConfig(targetItem.dataset.dndItemId);
    if (
      !isNil(targetItemConfig.dndStartTrigger) &&
      !this.cursorOverElement([event.srcEvent.clientX, event.srcEvent.clientY], targetItemConfig.dndStartTrigger)
    ) {
      return;
    }

    this.selectedDndItemIds.add(targetItem.dataset.dndItemId);

    this.dndService.processPanStart(event.srcEvent, this, this.injector, this.dndCloneItemsOffset);
  }

  private processDndMove(): Subscription {
    return this.dndService.dndEvents$
      .pipe(filterByInstanceOf(DndEvents.DndMove))
      .subscribe((dndMoveEvent: DndEvents.DndMove<Source>) => {
        const currentHostIsSource: boolean = dndMoveEvent.dndSourceHost === this;
        const currentHostIsTarget: boolean = this.cursorOverElement(
          dndMoveEvent.dndCloneCoords,
          this.elementRef.nativeElement
        );

        const dndSourceItems: DndItem<Source>[] = dndMoveEvent.dndSourceItemConfigs.map(
          ({ dndItem }: DndItemConfig<Source>) => dndItem
        );

        if (!currentHostIsTarget) {
          this.dndMove.next({
            dndSourceItems,
            dndTargetItem: null,
            dndDropPosition: null,
            dndIndicatorCoords: null,
            dndCloneCoords: dndMoveEvent.dndCloneCoords,
            dndSourceHostId: dndMoveEvent.dndSourceHost.getHostId(),
            currentHostIsSource,
            currentHostIsTarget,
          });
          return;
        }

        if (isNil(dndMoveEvent.dndTargetItemId)) {
          return;
        }

        const dndTargetItemConfig: DndItemConfig<Target> | undefined = this.dndItemsRegistryService.getDndItemConfig(
          dndMoveEvent.dndTargetItemId
        );

        if (isNil(dndTargetItemConfig)) {
          return;
        }

        const dndTargetItem: DndItem<Target> = dndTargetItemConfig.dndItem;
        const dndDropPosition: DndDropPosition = this.calcDndDropPosition(
          dndTargetItem.elementParts,
          dndMoveEvent.dndCloneCoords
        );
        const dndIndicatorCoords: number = this.calcDndIndicatorCoords(dndTargetItem.elementParts[0], dndDropPosition);

        this.dndMove.next({
          dndSourceItems,
          dndTargetItem,
          dndDropPosition,
          dndIndicatorCoords,
          dndCloneCoords: dndMoveEvent.dndCloneCoords,
          dndSourceHostId: dndMoveEvent.dndSourceHost.getHostId(),
          currentHostIsSource,
          currentHostIsTarget,
        });
      });
  }

  private processDndDrop(): Subscription {
    return this.dndService.dndEvents$
      .pipe(filterByInstanceOf(DndEvents.DndDrop))
      .subscribe((dndDropEvent: DndEvents.DndDrop<Source>) => {
        const currentHostIsSource: boolean = dndDropEvent.dndSourceHost === this;
        const currentHostIsTarget: boolean = this.cursorOverElement(
          dndDropEvent.dndCloneCoords,
          this.elementRef.nativeElement
        );

        if (!(currentHostIsTarget || currentHostIsSource)) {
          return;
        }

        const dndSourceItems: DndItem<Source>[] = dndDropEvent.dndSourceItemConfigs.map(
          ({ dndItem }: DndItemConfig<Source>) => dndItem
        );

        if (currentHostIsSource && !currentHostIsTarget) {
          this.dndDrop.next({
            dndSourceItems,
            dndTargetItem: null,
            dndDropPosition: null,
            dndSourceHostId: dndDropEvent.dndSourceHost.getHostId(),
            dndTargetHostId: dndDropEvent.dndTargetHostId,
            currentHostIsSource,
            currentHostIsTarget,
          });
          return;
        }

        const dndTargetItemConfig: DndItemConfig<Target> = this.dndItemsRegistryService.getDndItemConfig(
          dndDropEvent.dndTargetItemId
        );
        const dndDropPosition: DndDropPosition = this.calcDndDropPosition(
          dndTargetItemConfig.dndItem.elementParts,
          dndDropEvent.dndCloneCoords
        );
        const allSourceItemsCanBeDroppedToTargetItem: boolean = dndTargetItemConfig.canBeDroppableFor(
          dndTargetItemConfig.dndItem,
          dndSourceItems,
          dndDropPosition
        );

        if (allSourceItemsCanBeDroppedToTargetItem) {
          this.dndDrop.next({
            dndSourceItems,
            dndTargetItem: dndTargetItemConfig.dndItem,
            dndDropPosition,
            dndSourceHostId: dndDropEvent.dndSourceHost.getHostId(),
            dndTargetHostId: dndDropEvent.dndTargetHostId,
            currentHostIsSource,
            currentHostIsTarget,
          });
        }
      });
  }

  private cursorOverElement([positionX, positionY]: [number, number], element: Element): boolean {
    const elementRect: DOMRect = element.getBoundingClientRect();

    return (
      elementRect.left <= positionX &&
      elementRect.right >= positionX &&
      elementRect.top <= positionY &&
      elementRect.bottom >= positionY
    );
  }

  private calcDndDropPosition(
    targetItemElementParts: DndItemHtmlElement[],
    [dndCloneX, dndCloneY]: [number, number]
  ): DndDropPosition {
    for (const elementPart of targetItemElementParts) {
      const elementPartRect: DOMRect = elementPart.getBoundingClientRect();

      if (this.dndItemsDirection === 'row') {
        if (dndCloneX < elementPartRect.left + elementPartRect.width * DND_POSITION_PERCENT) {
          return 'before';
        }

        if (dndCloneX > elementPartRect.right - elementPartRect.width * DND_POSITION_PERCENT) {
          return 'after';
        }
      }

      if (this.dndItemsDirection === 'column') {
        if (dndCloneY < elementPartRect.top + elementPartRect.height * DND_POSITION_PERCENT) {
          return 'before';
        }

        if (dndCloneY > elementPartRect.bottom - elementPartRect.height * DND_POSITION_PERCENT) {
          return 'after';
        }
      }
    }

    return 'within';
  }

  private calcDndIndicatorCoords(elementPart: DndItemHtmlElement, dndDropPosition: DndDropPosition): number | null {
    if (dndDropPosition === 'within') {
      return null;
    }

    const itemClientRect: DOMRect = elementPart.getBoundingClientRect();
    const hostClientRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();

    if (this.dndItemsDirection === 'column') {
      if (dndDropPosition === 'before') {
        return itemClientRect.top - hostClientRect.top;
      }

      if (dndDropPosition === 'after') {
        return itemClientRect.bottom - hostClientRect.top;
      }
    } else {
      if (dndDropPosition === 'before') {
        return itemClientRect.left - hostClientRect.left;
      }

      if (dndDropPosition === 'after') {
        return itemClientRect.right - hostClientRect.left;
      }
    }
  }
}
