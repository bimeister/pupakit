import { TrackByFunction, Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { ControllerOptions } from '../../interfaces/controller-options.interface';
import { DataDisplayCollectionRef } from '../../interfaces/data-display-collection-ref.interface';
import { DataDisplayCollection } from '../data-display-collection.class';
import { DataEventBase } from '../data-event-base.class';
import { DefaultEventHandler } from '../default-event-handler.class';
import { DataEvent } from '../event/data.event';
import { QueueEvent } from '../event/queue.event';
import { FlatTreeItem } from '../flat-tree-item.class';
import { Queue } from '../queue.class';

export abstract class ControllerBase<O extends ControllerOptions> {
  protected readonly dataDisplayCollection: DataDisplayCollection;
  protected readonly queue: Queue;
  protected readonly handler: DefaultEventHandler;
  public readonly eventBus: EventBus = new EventBus();

  constructor(protected readonly options?: Nullable<O>) {
    this.eventBus = new EventBus();
    this.queue = new Queue(this.eventBus);
    this.dataDisplayCollection = this.getDataDisplayCollection();
    this.handler = this.getHandler();
    this.setHasDragAndDrop(options?.hasDragAndDrop);
    this.setScrollBehavior(options?.scrollBehavior);
    this.setTrackBy(options?.trackBy);
  }

  protected getDataDisplayCollection(): DataDisplayCollection {
    return new DataDisplayCollection();
  }

  protected getHandler(): DefaultEventHandler {
    return new DefaultEventHandler(this.eventBus, this.dataDisplayCollection);
  }

  protected dispatchInQueue(event: DataEventBase): void {
    const queueEvent: QueueEvent.AddToQueue = new QueueEvent.AddToQueue(event);
    this.eventBus.dispatch(queueEvent);
  }

  public getOptions(): Nullable<O> {
    return this.options;
  }

  public getDataDisplayCollectionRef(): DataDisplayCollectionRef {
    return this.dataDisplayCollection;
  }

  public scrollTo(treeItemId: string): void {
    this.dispatchInQueue(new DataEvent.ScrollById(treeItemId));
  }

  public setData(data: FlatTreeItem[]): void {
    this.dispatchInQueue(new DataEvent.SetData(data));
  }

  public removeTreeItem(treeItemId: string): void {
    this.dispatchInQueue(new DataEvent.RemoveItem(treeItemId));
  }

  public setTreeItem(treeItem: FlatTreeItem): void {
    this.dispatchInQueue(new DataEvent.UpdateItem(treeItem));
  }

  public setSelected(...selectedIds: string[]): void {
    this.dispatchInQueue(new DataEvent.SetSelected(selectedIds));
  }

  public setLoading(isLoading: boolean): void {
    this.dispatchInQueue(new DataEvent.SetLoading(isLoading));
  }

  public getEvents<T extends DataEventBase>(eventType: Type<T>): Observable<T> {
    return this.queue.getEvents(eventType);
  }

  private setScrollBehavior(scrollBehavior: ScrollBehavior = 'smooth'): void {
    this.dataDisplayCollection.scrollBehavior$.next(scrollBehavior);
  }

  private setTrackBy(trackBy: TrackByFunction<FlatTreeItem> = DataDisplayCollection.trackBy): void {
    this.dataDisplayCollection.trackBy$.next(trackBy);
  }

  private setHasDragAndDrop(hasDragAndDrop: boolean = false): void {
    this.dataDisplayCollection.hasDragAndDrop$.next(hasDragAndDrop);
  }
}
