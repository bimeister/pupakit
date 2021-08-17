import { Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { filter, withLatestFrom } from 'rxjs/operators';
import { DataDisplayCollection } from './data-display-collection.class';
import { DataEventBase } from './data-event-base.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { QueueEvents } from '../events/queue.events';
import { DataEvents } from '../events/data.events';

export class DefaultEventHandler {
  protected subscription: Subscription = new Subscription();

  constructor(protected readonly eventBus: EventBus, protected readonly dataDisplayCollection: DataDisplayCollection) {
    this.reconnect();
  }

  protected subscribeToEvents(): void {
    this.subscription.add(this.getSubscriptionForUpdateItem());
    this.subscription.add(this.getSubscriptionForRemoveItem());
    this.subscription.add(this.getSubscriptionForScrollTo());
  }

  protected getSubscriptionForScrollTo(): Subscription {
    return this.getEvents(DataEvents.ScrollById)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$))
      .subscribe(([event, data]: [DataEvents.ScrollById, FlatTreeItem[]]) => {
        const treeItem: FlatTreeItem = DefaultEventHandler.getTreeItem(event.payload, data);
        if (isNil(treeItem)) {
          return this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
        }
        const index: number = data.indexOf(treeItem);
        this.eventBus.dispatch(new DataEvents.ScrollByIndex(index));
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
      });
  }

  protected getSubscriptionForRemoveItem(): Subscription {
    return this.getEvents(DataEvents.RemoveItem)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$))
      .subscribe(([event, data]: [DataEvents.RemoveItem, FlatTreeItem[]]) => {
        this.removeItem(event.payload, data);
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
      });
  }

  protected getSubscriptionForUpdateItem(): Subscription {
    return this.getEvents(DataEvents.UpdateItem)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$))
      .subscribe(([event, data]: [DataEvents.UpdateItem, FlatTreeItem[]]) => {
        this.updateItem(event.payload, data);
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
      });
  }

  protected updateItem(updatedItem: FlatTreeItem, data: FlatTreeItem[]): void {
    const treeItemExists: boolean = DefaultEventHandler.treeItemExists(updatedItem.id, data);
    if (!treeItemExists) {
      return;
    }
    const updatedData: FlatTreeItem[] = data.map((treeItem: FlatTreeItem) => {
      if (treeItem.id !== updatedItem.id) {
        return new FlatTreeItem(
          treeItem.isExpandable,
          updatedItem.name,
          treeItem.level,
          treeItem.id,
          updatedItem.originalData,
          treeItem.isElement
        );
      }
      return treeItem;
    });
    this.eventBus.dispatch(new DataEvents.SetData(updatedData));
  }

  protected removeItem(removeItemId: string, data: FlatTreeItem[]): void {
    const treeItemExists: boolean = DefaultEventHandler.treeItemExists(removeItemId, data);
    if (!treeItemExists) {
      return;
    }
    const updatedData: FlatTreeItem[] = data.filter((treeItem: FlatTreeItem) => {
      return treeItem.id !== removeItemId;
    });
    this.eventBus.dispatch(new DataEvents.SetData(updatedData));
  }

  public reconnect(): void {
    this.disconnect();
    this.subscribeToEvents();
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  public getEvents<T extends DataEventBase>(eventType: Type<T>): Observable<T> {
    return this.eventBus.catchEvents().pipe(filter((event: DataEventBase): event is T => event instanceof eventType));
  }

  protected static treeItemExists(treeItemId: string, data: FlatTreeItem[]): boolean {
    const treeItem: FlatTreeItem = DefaultEventHandler.getTreeItem(treeItemId, data);
    return !isNil(treeItem);
  }

  protected static getTreeItem(treeItemId: string, data: FlatTreeItem[]): FlatTreeItem {
    return data.find((treeItem: FlatTreeItem) => treeItem.id === treeItemId);
  }
}
