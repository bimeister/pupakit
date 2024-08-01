import { TrackByFunction, Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { TreeEvents } from '../events/tree.events';
import { TreeControllerOptions } from '../interfaces/tree-controller-options.interface';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { DefaultTreeEventHandler } from './default-tree-event-handler.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeDataDisplayCollection } from './tree-data-display-collection.class';
import { DEFAULT_TREE_ITEM_SIZE_REM } from '../constants/default-tree-item-size-rem.const';
import { EventsQueue, QueueEvents } from '@bimeister/pupakit.common';

export class TreeController {
  public readonly eventBus: EventBus = new EventBus();

  protected readonly queue: EventsQueue = new EventsQueue(this.eventBus);
  protected readonly dataDisplayCollection: TreeDataDisplayCollection = new TreeDataDisplayCollection();
  protected readonly handler: DefaultTreeEventHandler = new DefaultTreeEventHandler(
    this.eventBus,
    this.dataDisplayCollection
  );

  constructor(protected readonly options?: Nullable<TreeControllerOptions>) {
    this.setScrollBehavior(options?.scrollBehavior);
    this.setTrackBy(options?.trackBy);
    this.setHasDragAndDrop(options?.hasDragAndDrop);
    this.setTreeItemSizeRem(options?.treeItemSizeRem);
  }

  protected dispatchInQueue(event: TreeEvents.TreeEventBase): void {
    const queueEvent: QueueEvents.AddToQueue = new QueueEvents.AddToQueue(event);
    this.eventBus.dispatch(queueEvent);
  }

  public getOptions(): Nullable<TreeControllerOptions> {
    return this.options;
  }

  public setData(data: FlatTreeItem[]): void {
    this.dispatchInQueue(new TreeEvents.SetData(data));
  }

  public setSelected(...selectedIds: string[]): void {
    this.dispatchInQueue(new TreeEvents.SetSelected(selectedIds));
  }

  public setLoading(isLoading: boolean): void {
    this.eventBus.dispatch(new TreeEvents.SetLoading(isLoading));
  }

  public setHasDragAndDrop(hasDragAndDrop: boolean = false): void {
    this.dataDisplayCollection.hasDragAndDrop$.next(hasDragAndDrop);
  }

  public getEvents<E extends TreeEvents.TreeEventBase>(eventType: Type<E>): Observable<E> {
    return this.queue.getEvents(eventType);
  }

  public getDataDisplayCollectionRef(): TreeDataDisplayCollectionRef {
    return this.dataDisplayCollection;
  }

  public expand(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Expand(treeItem));
  }

  public addChildren(treeItemId: string, children: FlatTreeItem[]): void {
    this.dispatchInQueue(new TreeEvents.AddChildren({ treeItemId, children }));
  }

  public resetChildren(treeItemId: string, children: FlatTreeItem[]): void {
    this.dispatchInQueue(new TreeEvents.ResetChildren({ treeItemId, children }));
  }

  public removeChildren(treeItemId: string): void {
    this.dispatchInQueue(new TreeEvents.RemoveChildren(treeItemId));
  }

  public removeTreeItem(treeItemId: string): void {
    this.dispatchInQueue(new TreeEvents.RemoveItem(treeItemId));
  }

  public setTreeItem(treeItem: FlatTreeItem): void {
    this.dispatchInQueue(new TreeEvents.UpdateItem(treeItem));
  }

  public scrollTo(treeItemId: string): void {
    this.dispatchInQueue(new TreeEvents.ScrollById(treeItemId));
  }

  public scrollTop(scrollTopPx: number): void {
    this.dispatchInQueue(new TreeEvents.ScrollTop(scrollTopPx));
  }

  private setScrollBehavior(scrollBehavior: ScrollBehavior = 'smooth'): void {
    this.dataDisplayCollection.scrollBehavior$.next(scrollBehavior);
  }

  private setTrackBy(trackBy: TrackByFunction<FlatTreeItem> = TreeDataDisplayCollection.trackBy): void {
    this.dataDisplayCollection.trackBy$.next(trackBy);
  }

  private setTreeItemSizeRem(treeItemSizeRem: number = DEFAULT_TREE_ITEM_SIZE_REM): void {
    this.dataDisplayCollection.treeItemSizeRem$.next(treeItemSizeRem);
  }
}
