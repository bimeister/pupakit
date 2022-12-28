import { Inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { DndCloneService } from './dnd-clone.service';
import { DOCUMENT } from '@angular/common';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { DndEvents } from '../declarations/events/dnd.events';
import { Observable } from 'rxjs';
import { DndHostComponent } from '../components/dnd/components/dnd-host/dnd-host.component';
import { DndCloneData } from '../declarations/interfaces/dnd-clone-data.interface';
import { DndItemHtmlElement } from '../declarations/interfaces/dnd-item-html-element.interface';
import { getDndTargetItemFromEvent } from '../declarations/functions/get-dnd-target-item-from-event.function';
import { isEmpty, isNil } from '@bimeister/utilities';
import { DndItemConfig } from '../declarations/interfaces/dnd-item-config.interface';

@Injectable({ providedIn: 'root' })
export class DndService implements OnDestroy {
  private sourceHost: DndHostComponent | null = null;
  private sourceDndItemConfigs: DndItemConfig[] | null = null;
  private currentDndCloneItemsOffset: number | null = null;

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.document.body);
  private readonly eventBus: EventBus = new EventBus();

  public readonly dndEvents$: Observable<unknown> = this.eventBus.listen();

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly dndCloneService: DndCloneService
  ) {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
  }

  public ngOnDestroy(): void {
    this.hammerManager.destroy();
  }

  public processPanStart(
    sourceDndItemConfigs: DndItemConfig[],
    sourceHost: DndHostComponent,
    dndCloneItemsOffset: number,
    event: HammerInput,
    hostInjector: Injector
  ): void {
    if (isEmpty(sourceDndItemConfigs) || !(event.srcEvent instanceof PointerEvent)) {
      return;
    }

    this.sourceHost = sourceHost;
    this.sourceDndItemConfigs = sourceDndItemConfigs;
    this.currentDndCloneItemsOffset = dndCloneItemsOffset;

    const selectedDndItemsCloneData: DndCloneData[] = sourceDndItemConfigs.map(
      (selectedDndItemConfig: DndItemConfig) => ({
        heightPx: selectedDndItemConfig.dndItem.elementParts[0].offsetHeight,
        templateRef: selectedDndItemConfig.itemTemplate,
        templateContext: { $implicit: selectedDndItemConfig.dndItem.data },
      })
    );
    this.dndCloneService.create(selectedDndItemsCloneData, hostInjector);
    this.dndCloneService.updatePosition(
      [event.srcEvent.clientX, event.srcEvent.clientY],
      this.currentDndCloneItemsOffset
    );

    this.initPanListeners();
  }

  private initPanListeners(): void {
    this.hammerManager.on('pan', (event: HammerInput) => this.processPan(event));
    this.hammerManager.on('panend', (event: HammerInput) => this.processPanEnd(event));
  }

  private processPan(event: HammerInput): void {
    if (!(event.srcEvent instanceof PointerEvent)) {
      return;
    }

    this.dndCloneService.updatePosition(
      [event.srcEvent.clientX, event.srcEvent.clientY],
      this.currentDndCloneItemsOffset
    );

    const targetDndItemElement: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);

    this.eventBus.dispatch(
      new DndEvents.DndMove(
        this.sourceDndItemConfigs,
        targetDndItemElement?.dataset?.dndItemId ?? null,
        [event.srcEvent.clientX, event.srcEvent.clientY],
        this.sourceHost
      )
    );
  }

  private processPanEnd(event: HammerInput): void {
    if (!(event.srcEvent instanceof PointerEvent)) {
      return;
    }

    this.dndCloneService.destroy();
    this.clearPanListeners();

    this.sourceHost.clearSelectedDndItems();

    const targetDndItemElement: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);
    if (isNil(targetDndItemElement)) {
      return;
    }

    this.eventBus.dispatch(
      new DndEvents.DndDrop(
        this.sourceDndItemConfigs,
        targetDndItemElement.dataset.dndItemId,
        [event.srcEvent.clientX, event.srcEvent.clientY],
        this.sourceHost
      )
    );

    this.sourceHost = null;
    this.sourceDndItemConfigs = null;
    this.currentDndCloneItemsOffset = null;
  }

  private clearPanListeners(): void {
    this.hammerManager.off('pan');
    this.hammerManager.off('panend');
  }
}
