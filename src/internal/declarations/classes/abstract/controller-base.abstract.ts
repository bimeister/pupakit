import { TrackByFunction, Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { ControllerOptions } from '../../interfaces/controller-options.interface';
import { DataDisplayCollectionRef } from '../../interfaces/data-display-collection-ref.interface';
import { DataDisplayCollection } from '../data-display-collection.class';
import { DataEventBase } from '../data-event-base.class';
import { DefaultEventHandler } from '../default-event-handler.class';
import { EventsQueue } from '../events-queue.class';
import { QueueEvents } from '../../events/queue.events';
import { DataEvents } from '../../events/data.events';

export abstract class ControllerBase<T, O extends ControllerOptions<T> = ControllerOptions<T>> {
  protected readonly dataDisplayCollection: DataDisplayCollection<T>;
  protected readonly queue: EventsQueue;
  protected readonly handler: DefaultEventHandler<T>;
  public readonly eventBus: EventBus = new EventBus();

  constructor(protected readonly options?: Nullable<O>) {
    this.queue = new EventsQueue(this.eventBus);
    this.dataDisplayCollection = this.getDataDisplayCollection();
    this.handler = this.getHandler();
    this.setScrollBehavior(options?.scrollBehavior);
    this.setTrackBy(options?.trackBy);
  }

  protected getDataDisplayCollection(): DataDisplayCollection<T> {
    return new DataDisplayCollection();
  }

  protected getHandler(): DefaultEventHandler<T> {
    return new DefaultEventHandler(this.eventBus, this.dataDisplayCollection);
  }

  protected dispatchInQueue(event: DataEventBase): void {
    const queueEvent: QueueEvents.AddToQueue = new QueueEvents.AddToQueue(event);
    this.eventBus.dispatch(queueEvent);
  }

  public getOptions(): Nullable<O> {
    return this.options;
  }

  public getDataDisplayCollectionRef(): DataDisplayCollectionRef<T> {
    return this.dataDisplayCollection;
  }

  public setData(data: T[]): void {
    this.dispatchInQueue(new DataEvents.SetData(data));
  }

  public setSelected(...selectedIds: string[]): void {
    this.dispatchInQueue(new DataEvents.SetSelected(selectedIds));
  }

  public setLoading(isLoading: boolean): void {
    this.eventBus.dispatch(new DataEvents.SetLoading(isLoading));
  }

  public getEvents<E extends DataEventBase>(eventType: Type<E>): Observable<E> {
    return this.queue.getEvents(eventType);
  }

  private setScrollBehavior(scrollBehavior: ScrollBehavior = 'smooth'): void {
    this.dataDisplayCollection.scrollBehavior$.next(scrollBehavior);
  }

  private setTrackBy(trackBy: TrackByFunction<T> = DataDisplayCollection.trackBy): void {
    this.dataDisplayCollection.trackBy$.next(trackBy);
  }
}
