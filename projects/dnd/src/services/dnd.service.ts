import { Inject, Injectable, Injector, OnDestroy, TemplateRef } from '@angular/core';
import { DndCloneService } from './dnd-clone.service';
import { DOCUMENT } from '@angular/common';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { Observable } from 'rxjs';
import { DndHostComponent } from '../components/dnd-host/dnd-host.component';
import { isNil } from '@bimeister/utilities';
import { DndItemConfig } from '../declarations/interfaces/dnd-item-config.interface';
import { DndItemHtmlElement } from '../declarations/interfaces/dnd-item-html-element.interface';
import { getDndTargetItemFromEvent } from '../declarations/functions/get-dnd-target-item-from-event.function';
import { DndEvents } from '../declarations/events/dnd.events';
import { DndHostHtmlElement } from '../declarations/interfaces/dnd-host-html-element.interface';
import { getDndHostElementFromEvent } from '../declarations/functions/get-dnd-host-from-event.function';

@Injectable({ providedIn: 'root' })
export class DndService implements OnDestroy {
  private sourceHost: DndHostComponent | null = null;
  private sourceDndItemConfigs: DndItemConfig[] | null = null;

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.document.body, {
    cssProps: undefined,
    touchAction: 'auto',
  });
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
    srcEvent: PointerEvent,
    sourceHost: DndHostComponent,
    hostInjector: Injector,
    dndCloneItemsTemplateRef: TemplateRef<unknown>
  ): void {
    this.sourceHost = sourceHost;
    this.sourceDndItemConfigs = this.sourceHost.getSelectedDndItemConfigs();

    this.dndCloneService.create(
      {
        templateContext: {
          $implicit: this.sourceDndItemConfigs.map(
            (selectedDndItemConfig: DndItemConfig) => selectedDndItemConfig.dndItem
          ),
        },
        templateRef: dndCloneItemsTemplateRef,
      },
      hostInjector
    );
    this.dndCloneService.updatePosition([srcEvent.clientX, srcEvent.clientY]);

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

    this.dndCloneService.updatePosition([event.srcEvent.clientX, event.srcEvent.clientY]);

    const targetDndItemElement: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);

    this.eventBus.dispatch(
      new DndEvents.DndMove(
        this.sourceHost,
        this.sourceDndItemConfigs,
        targetDndItemElement?.dataset?.dndItemId ?? null,
        [event.srcEvent.clientX, event.srcEvent.clientY]
      )
    );
  }

  private processPanEnd(event: HammerInput): void {
    if (!(event.srcEvent instanceof PointerEvent)) {
      return;
    }

    this.dndCloneService.destroy();
    this.removePanListeners();

    this.sourceHost.clearSelectedDndItems();

    const targetDndItemElement: DndItemHtmlElement | null = getDndTargetItemFromEvent(event.srcEvent);

    if (isNil(targetDndItemElement)) {
      return;
    }

    const targetHostElement: DndHostHtmlElement = getDndHostElementFromEvent(event.srcEvent);

    this.eventBus.dispatch(
      new DndEvents.DndDrop(
        this.sourceHost,
        this.sourceDndItemConfigs,
        targetDndItemElement.dataset.dndItemId,
        targetHostElement.dataset.dndHostId,
        [event.srcEvent.clientX, event.srcEvent.clientY]
      )
    );

    this.sourceHost = null;
    this.sourceDndItemConfigs = null;
  }

  private removePanListeners(): void {
    this.hammerManager.off('pan');
    this.hammerManager.off('panend');
  }
}
