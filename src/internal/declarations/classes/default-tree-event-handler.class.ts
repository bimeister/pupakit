import { EventBus } from '@bimeister/event-bus';
import { isNil } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { DefaultEventHandler } from './default-event-handler.class';
import { DataEvent } from './event/data.event';
import { QueueEvent } from './event/queue.event';
import { TreeEvent } from './event/tree.event';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeDataDisplayCollection } from './tree-data-display-collection.class';

export class DefaultTreeEventHandler extends DefaultEventHandler {
  constructor(
    protected readonly eventBus: EventBus,
    protected readonly dataDisplayCollection: TreeDataDisplayCollection
  ) {
    super(eventBus, dataDisplayCollection);
  }

  protected getSubscriptionForRemoveItem(): Subscription {
    return this.getEvents(DataEvent.RemoveItem)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$, this.dataDisplayCollection.expandedIdsList$))
      .subscribe(([event, data, expandedIdsList]: [DataEvent.RemoveItem, FlatTreeItem[], string[]]) => {
        this.removeItemWithChildren(event.payload, data, expandedIdsList);
        this.eventBus.dispatch(new QueueEvent.RemoveFromQueue(event.id));
      });
  }

  protected subscribeToEvents(): void {
    super.subscribeToEvents();
    this.subscription.add(this.getSubscriptionForRemoveChildren());
    this.subscription.add(this.getSubscriptionForSetChildren());
  }

  private getSubscriptionForSetChildren(): Subscription {
    return this.getEvents(TreeEvent.SetChildren)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$, this.dataDisplayCollection.expandedIdsList$))
      .subscribe(([event, data, expandedIdsList]: [TreeEvent.SetChildren, FlatTreeItem[], string[]]) => {
        this.setChildren(event.payload.treeItemId, event.payload.children, data, expandedIdsList);
        this.eventBus.dispatch(new QueueEvent.RemoveFromQueue(event.id));
      });
  }

  private getSubscriptionForRemoveChildren(): Subscription {
    return this.getEvents(TreeEvent.RemoveChildren)
      .pipe(withLatestFrom(this.dataDisplayCollection.data$, this.dataDisplayCollection.expandedIdsList$))
      .subscribe(([event, data, expandedIdsList]: [TreeEvent.RemoveChildren, FlatTreeItem[], string[]]) => {
        this.removeChildren(event.payload, data, expandedIdsList);
        this.eventBus.dispatch(new QueueEvent.RemoveFromQueue(event.id));
      });
  }

  private setChildren(
    parentId: string,
    children: FlatTreeItem[],
    data: FlatTreeItem[],
    expandedIdsList: string[]
  ): void {
    if (isNil(parentId)) {
      const newData: FlatTreeItem[] = children.map(treeItem => ({ ...treeItem, level: 0 }));
      this.eventBus.dispatch(new DataEvent.SetData(newData));
      return;
    }
    const parent: FlatTreeItem = DefaultEventHandler.getTreeItem(parentId, data);
    const isExpanded: boolean = expandedIdsList.includes(parentId);
    if (isNil(parent) || isExpanded) {
      return;
    }
    const childrenWithLevel: FlatTreeItem[] = children.map((childItem: FlatTreeItem) => {
      return {
        ...childItem,
        level: parent.level + 1
      };
    });
    const parentIndex: number = data.indexOf(parent);
    const dataWithChildren: FlatTreeItem[] = [
      ...data.slice(0, parentIndex),
      parent,
      ...childrenWithLevel,
      ...data.slice(parentIndex + 1)
    ];
    const newExpandedList: string[] = [...expandedIdsList, parent.id];
    this.eventBus.dispatch(new DataEvent.SetData(dataWithChildren));
    this.eventBus.dispatch(new TreeEvent.SetExpanded(newExpandedList));
  }

  private removeItemWithChildren(removeItemId: string, data: FlatTreeItem[], expanded: string[]): void {
    const treeItemExists: boolean = DefaultEventHandler.treeItemExists(removeItemId, data);
    if (!treeItemExists) {
      return;
    }
    const [dataWithoutChildren, expandedWithoutChildren]: [FlatTreeItem[], string[]] = this.getRemovedChildren(
      removeItemId,
      data,
      expanded
    );
    const dataWithoutRemovedItem: FlatTreeItem[] = dataWithoutChildren.filter((treeItem: FlatTreeItem) => {
      return treeItem.id !== removeItemId;
    });
    this.eventBus.dispatch(new DataEvent.SetData(dataWithoutRemovedItem));
    this.eventBus.dispatch(new TreeEvent.SetExpanded(expandedWithoutChildren));
  }

  private removeChildren(parentId: string, data: FlatTreeItem[], expanded: string[]): void {
    const [dataWithoutChildren, expandedWithoutChildren]: [FlatTreeItem[], string[]] = this.getRemovedChildren(
      parentId,
      data,
      expanded
    );
    this.eventBus.dispatch(new DataEvent.SetData(dataWithoutChildren));
    this.eventBus.dispatch(new TreeEvent.SetExpanded(expandedWithoutChildren));
  }

  private getRemovedChildren(parentId: string, data: FlatTreeItem[], expanded: string[]): [FlatTreeItem[], string[]] {
    const parent: FlatTreeItem = DefaultEventHandler.getTreeItem(parentId, data);
    if (isNil(parent)) {
      return [data, expanded];
    }
    const parentIndex: number = data.indexOf(parent);
    const dataBeforeParent: FlatTreeItem[] = parentIndex === 0 ? [] : data.slice(0, parentIndex);
    const dataAfterParent: FlatTreeItem[] = data.slice(parentIndex + 1);
    const nextNonChildIndex: number = dataAfterParent.findIndex((child: FlatTreeItem) => {
      return child.level === parent.level;
    });
    const isLastParent: boolean = nextNonChildIndex === -1;
    const children: FlatTreeItem[] = dataAfterParent.slice(0, nextNonChildIndex);
    const childrenIdsList: string[] = children.map((child: FlatTreeItem) => child.id);
    const expandedWithoutChildren: string[] = expanded.filter(
      (expandedItemId: string) => !childrenIdsList.includes(expandedItemId) && expandedItemId !== parentId
    );
    const dataAfterLastChild: FlatTreeItem[] = isLastParent ? [] : dataAfterParent.slice(nextNonChildIndex);
    const dataWithoutChildren: FlatTreeItem[] = [...dataBeforeParent, parent, ...dataAfterLastChild];
    return [dataWithoutChildren, expandedWithoutChildren];
  }
}
