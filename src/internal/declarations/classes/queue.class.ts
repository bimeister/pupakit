import { Type } from '@angular/core';
import { BusEventBase, EventBus } from '@bimeister/event-bus';
import { isEmpty } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { DataEventBase } from './data-event-base.class';
import { QueueEvent } from './event/queue.event';

export class Queue {
  private readonly queue: DataEventBase[] = [];
  private readonly started$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly eventBus: EventBus) {
    this.subscription.add(this.getSubscriptionForStartEvents());
    this.subscription.add(this.getSubscriptionForAddEvents());
    this.subscription.add(this.getSubscriptionForRemoveEvents());
  }

  public getEvents<T extends BusEventBase>(eventType: Type<T>): Observable<T> {
    return this.eventBus.catchEvents().pipe(filter((event: BusEventBase): event is T => event instanceof eventType));
  }

  private getSubscriptionForStartEvents(): Subscription {
    return this.getEvents(QueueEvent.StartQueue).subscribe(() => {
      this.started$.next(true);
      this.next();
    });
  }

  private getSubscriptionForAddEvents(): Subscription {
    return this.getEvents(QueueEvent.AddToQueue)
      .pipe(withLatestFrom(this.started$))
      .subscribe(([addEvent, started]: [QueueEvent.AddToQueue, boolean]) => {
        const isEmptyQueue: boolean = isEmpty(this.queue);
        this.queue.push(addEvent.payload);
        if (isEmptyQueue && started) {
          this.eventBus.dispatch(addEvent.payload);
        }
      });
  }

  private getSubscriptionForRemoveEvents(): Subscription {
    return this.getEvents(QueueEvent.RemoveFromQueue)
      .pipe(filter((removeEvent: QueueEvent.RemoveFromQueue) => this.isFirst(removeEvent.payload)))
      .subscribe(() => {
        this.queue.shift();
        this.next();
      });
  }

  private isFirst(eventId: string): boolean {
    if (isEmpty(this.queue)) {
      return false;
    }
    return this.queue[0].id === eventId;
  }

  private next(): void {
    if (isEmpty(this.queue)) {
      return;
    }
    this.eventBus.dispatch(this.queue[0]);
  }
}
