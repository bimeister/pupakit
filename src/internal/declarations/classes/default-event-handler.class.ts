import { Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { Observable, Subscription } from 'rxjs';
import { filter, mapTo, switchMap } from 'rxjs/operators';
import { DataDisplayCollection } from './data-display-collection.class';
import { DataEventBase } from './data-event-base.class';
import { DataEvents } from '../events/data.events';
import { QueueEvents } from '../events/queue.events';

export class DefaultEventHandler<T> {
  protected subscription: Subscription = new Subscription();

  constructor(
    protected readonly eventBus: EventBus,
    protected readonly dataDisplayCollection: DataDisplayCollection<T>
  ) {
    this.reconnect();
  }

  protected subscribeToEvents(): void {
    this.subscription.add(this.getSubscriptionToSetData());
  }

  protected getSubscriptionToSetData(): Subscription {
    return this.getEvents(DataEvents.SetData)
      .pipe(
        switchMap((event: DataEvents.SetData<T>) => {
          return this.dataDisplayCollection.setData(event.payload).pipe(mapTo(event));
        })
      )
      .subscribe((event: DataEvents.SetData<T>) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  public reconnect(): void {
    this.disconnect();
    this.subscribeToEvents();
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  public getEvents<E extends DataEventBase>(eventType: Type<E>): Observable<E> {
    return this.eventBus.catchEvents().pipe(filter((event: DataEventBase): event is E => event instanceof eventType));
  }
}
