import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { QueueEvents } from '@bimeister/pupakit.common';
import { filterByInstanceOf } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';

export class TableScrollFeature<T> implements TableFeature {
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
