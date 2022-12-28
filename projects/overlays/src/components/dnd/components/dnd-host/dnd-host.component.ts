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
  ViewEncapsulation,
} from '@angular/core';
import { DndItemHtmlElement } from '../../../../declarations/interfaces/dnd-item-html-element.interface';
import { DndService } from '../../../../services/dnd.service';
import { filterByInstanceOf, isNil } from '@bimeister/utilities';
import { DndEvents } from '../../../../declarations/events/dnd.events';
import { Subscription } from 'rxjs';
import { DndDropData } from '../../../../declarations/interfaces/dnd-drop-data.interface';
import { DndMoveData } from '../../../../declarations/interfaces/dnd-move-data.interface';
import { getDndTargetItemFromEvent } from '../../../../declarations/functions/get-dnd-target-item-from-event.function';
import { DndItemRegistryService } from '../../../../services/dnd-item-registry.service';
import { DndItemConfig } from '../../../../declarations/interfaces/dnd-item-config.interface';
import { DndDropPosition } from '../../../../declarations/types/dnd-drop-position.type';
import { DndItem } from '../../../../declarations/interfaces/dnd-item.interface';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

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
export class DndHostComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public isDraggable: boolean = true;
  @Input() public dndItemsDirection: 'row' | 'column' = 'column';
  @Input() public dndCloneItemsOffset: number = DND_CLONE_OFFSET_PX;

  @Output() public readonly dndDrop: EventEmitter<DndDropData> = new EventEmitter<DndDropData>();
  @Output() public readonly dndMove: EventEmitter<DndMoveData> = new EventEmitter<DndMoveData>();

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);

  private readonly selectedDndItemIds: Set<string> = new Set<string>();

  private readonly subscription: Subscription = new Subscription();

  private listeningIsStarted: boolean = false;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly dndService: DndService,
    private readonly injector: Injector,
    private readonly dndItemsRegistryService: DndItemRegistryService
  ) {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
    this.hammerManager.add(new Hammer.Tap());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDraggableChanges(changes.isDraggable);
  }

  public ngOnInit(): void {
    if (this.isDraggable) {
      this.initListeners();
    }
  }

  public ngOnDestroy(): void {
    this.hammerManager.destroy();
    this.subscription.unsubscribe();
    this.listeningIsStarted = false;
  }

  public clearSelectedDndItems(): void {
    this.selectedDndItemIds.clear();
  }

  private processDraggableChanges(isDraggableChange?: ComponentChange<this, boolean>): void {
    if (isNil(isDraggableChange?.currentValue)) {
      return;
    }

    const isDraggable: boolean = isDraggableChange.currentValue;
    isDraggable ? this.initListeners() : this.ngOnDestroy();
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

  private processTap(event: HammerInput): void {
    const targetItem: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);
    if (isNil(targetItem) || !event.srcEvent.shiftKey) {
      return;
    }

    this.selectedDndItemIds.add(targetItem.dataset.dndItemId);
  }

  private processPanStart(event: HammerInput): void {
    const targetItem: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);
    if (isNil(targetItem)) {
      return;
    }

    this.selectedDndItemIds.add(targetItem.dataset.dndItemId);

    this.dndService.processPanStart(
      this.getSelectedDndItemConfigs(),
      this,
      this.dndCloneItemsOffset,
      event,
      this.injector
    );
  }

  private processDndMove(): Subscription {
    return this.dndService.dndEvents$
      .pipe(filterByInstanceOf(DndEvents.DndMove))
      .subscribe((dndMoveEvent: DndEvents.DndMove) => {
        const currentHostIsSource: boolean = dndMoveEvent.sourceHost === this;
        const currentHostIsTarget: boolean = this.currentHostIsTarget(dndMoveEvent.dndCloneCoords);

        const dndSourceItems: DndItem[] = dndMoveEvent.dndSourceItemConfigs.map(
          ({ dndItem }: DndItemConfig) => dndItem
        );

        if (!currentHostIsTarget) {
          this.dndMove.next({
            dndSourceItems,
            dndTargetItem: null,
            dndDropPosition: null,
            dndIndicatorCoords: null,
            currentHostIsSource,
            currentHostIsTarget,
            dndCloneCoords: dndMoveEvent.dndCloneCoords,
          });
          return;
        }

        if (isNil(dndMoveEvent.dndTargetItemId)) {
          return;
        }

        const dndTargetItemConfig: DndItemConfig | undefined = this.dndItemsRegistryService.getDndItemConfig(
          dndMoveEvent.dndTargetItemId
        );

        if (isNil(dndTargetItemConfig)) {
          return;
        }

        const dndTargetItem: DndItem = dndTargetItemConfig.dndItem;
        const dndDropPosition: DndDropPosition = this.calcDndDropPosition(
          dndTargetItem.elementParts,
          dndMoveEvent.dndCloneCoords
        );
        const dndIndicatorCoords: number = this.calcDndIndicatorCoords(dndTargetItem.elementParts[0]);

        this.dndMove.next({
          dndSourceItems,
          dndTargetItem,
          dndDropPosition,
          dndIndicatorCoords,
          currentHostIsSource,
          currentHostIsTarget,
          dndCloneCoords: dndMoveEvent.dndCloneCoords,
        });
      });
  }

  private processDndDrop(): Subscription {
    return this.dndService.dndEvents$
      .pipe(filterByInstanceOf(DndEvents.DndDrop))
      .subscribe((dndDropEvent: DndEvents.DndDrop) => {
        const currentHostIsSource: boolean = dndDropEvent.sourceHost === this;
        const currentHostIsTarget: boolean = this.currentHostIsTarget(dndDropEvent.dndCloneCoords);

        if (!(currentHostIsTarget || currentHostIsSource)) {
          return;
        }

        const dndSourceItems: DndItem[] = dndDropEvent.dndSourceItemConfigs.map(
          ({ dndItem }: DndItemConfig) => dndItem
        );

        if (currentHostIsSource && !currentHostIsTarget) {
          this.dndDrop.next({
            dndSourceItems,
            dndTargetItem: null,
            dndDropPosition: null,
            currentHostIsSource,
            currentHostIsTarget,
          });
          return;
        }

        const dndTargetItemConfig: DndItemConfig = this.dndItemsRegistryService.getDndItemConfig(
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
            currentHostIsSource,
            currentHostIsTarget,
          });
        }
      });
  }

  private getSelectedDndItemConfigs(): DndItemConfig[] {
    return Array.from(this.selectedDndItemIds)
      .map((selectedDndItemId: string) => this.dndItemsRegistryService.getDndItemConfig(selectedDndItemId))
      .filter((dndItemConfig: DndItemConfig) => dndItemConfig.canBeMoved(dndItemConfig.dndItem));
  }

  private currentHostIsTarget(dndCloneCoords: [number, number]): boolean {
    const hostElement: Element = this.elementRef.nativeElement;
    const hostElementRect: DOMRect = hostElement.getBoundingClientRect();

    return (
      hostElementRect.left <= dndCloneCoords[0] &&
      hostElementRect.right >= dndCloneCoords[0] &&
      hostElementRect.top <= dndCloneCoords[1] &&
      hostElementRect.bottom >= dndCloneCoords[1]
    );
  }

  private calcDndDropPosition(
    targetItemElementParts: DndItemHtmlElement[],
    dndCloneCoords: [number, number]
  ): DndDropPosition {
    for (const elementPart of targetItemElementParts) {
      const elementPartRect: DOMRect = elementPart.getBoundingClientRect();

      if (this.dndItemsDirection === 'row') {
        if (dndCloneCoords[0] > elementPartRect.right - elementPartRect.width * DND_POSITION_PERCENT) {
          return 'after';
        }
      } else {
        if (dndCloneCoords[1] > elementPartRect.bottom - elementPartRect.height * DND_POSITION_PERCENT) {
          return 'after';
        }
      }
    }

    return 'within';
  }

  private calcDndIndicatorCoords(elementPart: DndItemHtmlElement): number {
    const itemClientRect: DOMRect = elementPart.getBoundingClientRect();
    const hostClientRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();

    if (this.dndItemsDirection === 'row') {
      return itemClientRect.right - hostClientRect.right;
    }

    return itemClientRect.bottom - hostClientRect.top;
  }
}
