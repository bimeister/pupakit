import { TreeEvents } from '../events/tree.events';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { ControllerBase } from './abstract/controller-base.abstract';
import { DefaultTreeEventHandler } from './default-tree-event-handler.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeDataDisplayCollection } from './tree-data-display-collection.class';
import { DataEvents } from '../events/data.events';
import { Nullable } from '@bimeister/utilities';
import { TreeControllerOptions } from '../interfaces/tree-controller-options.interface';

export class TreeController extends ControllerBase<FlatTreeItem, TreeControllerOptions> {
  protected readonly dataDisplayCollection: TreeDataDisplayCollection;
  protected readonly handler: DefaultTreeEventHandler;

  constructor(protected readonly options?: Nullable<TreeControllerOptions>) {
    super();
    this.setHasDragAndDrop(options?.hasDragAndDrop);
  }

  protected getDataDisplayCollection(): TreeDataDisplayCollection {
    return new TreeDataDisplayCollection();
  }

  protected getHandler(): DefaultTreeEventHandler {
    return new DefaultTreeEventHandler(this.eventBus, this.dataDisplayCollection);
  }

  public getDataDisplayCollectionRef(): TreeDataDisplayCollectionRef {
    return this.dataDisplayCollection;
  }

  public setChildren(treeItemId: string, children: FlatTreeItem[]): void {
    this.dispatchInQueue(new TreeEvents.SetChildren({ treeItemId, children }));
  }

  public removeChildren(treeItemId: string): void {
    this.dispatchInQueue(new TreeEvents.RemoveChildren(treeItemId));
  }

  public removeTreeItem(treeItemId: string): void {
    this.dispatchInQueue(new DataEvents.RemoveItem(treeItemId));
  }

  public setTreeItem(treeItem: FlatTreeItem): void {
    this.dispatchInQueue(new DataEvents.UpdateItem(treeItem));
  }

  public scrollTo(treeItemId: string): void {
    this.dispatchInQueue(new DataEvents.ScrollById(treeItemId));
  }

  private setHasDragAndDrop(hasDragAndDrop: boolean = false): void {
    this.dataDisplayCollection.hasDragAndDrop$.next(hasDragAndDrop);
  }
}
