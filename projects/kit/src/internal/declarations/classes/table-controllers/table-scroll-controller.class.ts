import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { QueueEvents } from '../../events/queue.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeatureController } from '../../interfaces/table-feature-controller.interface';

export class TableScrollController<T> implements TableFeatureController {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly scrollBehavior$: Observable<ScrollBehavior> = this.api.displayData.scrollBehavior$;
  private readonly cdkVirtualScrollViewportRef: CdkVirtualScrollViewport = this.api.cdkVirtualScrollViewportRef;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processOuterScrollByIndexEvent());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processOuterScrollByIndexEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.ScrollByIndex),
        withLatestFrom(this.scrollBehavior$),
        map(([event, scrollBehavior]: [TableEvents.ScrollByIndex, ScrollBehavior]) => {
          this.cdkVirtualScrollViewportRef.scrollToIndex(event.index, scrollBehavior);
          return event;
        })
      )
      .subscribe((event: TableEvents.ScrollByIndex) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }
}
