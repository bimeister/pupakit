import { Type } from '@angular/core';
import { BusEventBase, EventBus } from '@bimeister/event-bus';
import { isEmpty } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { QueueEvents } from '../events/queue.events';

export class EventsQueue {
  private readonly queue: BusEventBase[] = [];
  private readonly started$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly eventBus: EventBus) {
    this.subscription.add(this.getSubscriptionForStartEvents());
    this.subscription.add(this.getSubscriptionForAddEvents());
    this.subscription.add(this.getSubscriptionForRemoveEvents());
  }

  public removeEventFromQueue(eventId: string): void {
    const eventIndex: number = this.queue.findIndex((event: BusEventBase) => event.id === eventId);
    if (eventIndex === -1) {
      return;
    }
    this.queue.splice(eventIndex, 1);
  }

  public clearQueue(): void {
    this.queue.splice(0, this.queue.length);
  }

  public getEvents<T extends BusEventBase>(eventType: Type<T>): Observable<T> {
    return this.eventBus.catchEvents().pipe(filter((event: BusEventBase): event is T => event instanceof eventType));
  }

  private getSubscriptionForStartEvents(): Subscription {
    return this.getEvents(QueueEvents.StartQueue).subscribe(() => {
      this.started$.next(true);
      this.dispatchFromQueue();
    });
  }

  private getSubscriptionForAddEvents(): Subscription {
    return this.getEvents(QueueEvents.AddToQueue)
      .pipe(withLatestFrom(this.started$))
      .subscribe(([addEvent, started]: [QueueEvents.AddToQueue, boolean]) => {
        const isEmptyQueue: boolean = isEmpty(this.queue);
        this.queue.push(addEvent.payload);
        if (isEmptyQueue && started) {
          this.eventBus.dispatch(addEvent.payload);
        }
      });
  }

  private getSubscriptionForRemoveEvents(): Subscription {
    return this.getEvents(QueueEvents.RemoveFromQueue)
      .pipe(filter((removeEvent: QueueEvents.RemoveFromQueue) => this.isFirstEventInQueue(removeEvent.payload)))
      .subscribe(() => {
        this.queue.shift();
        this.dispatchFromQueue();
      });
  }

  private isFirstEventInQueue(eventId: string): boolean {
    if (isEmpty(this.queue)) {
      return false;
    }
    return this.queue[0].id === eventId;
  }

  private dispatchFromQueue(): void {
    if (isEmpty(this.queue)) {
      return;
    }
    this.eventBus.dispatch(this.queue[0]);
  }
}
