import { TreeEvents } from '../events/tree.events';
import { ControllerOptions } from '../interfaces/controller-options.interface';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { ControllerBase } from './abstract/controller-base.abstract';
import { DefaultTreeEventHandler } from './default-tree-event-handler.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeDataDisplayCollection } from './tree-data-display-collection.class';

export class TreeController extends ControllerBase<ControllerOptions> {
  protected readonly dataDisplayCollection: TreeDataDisplayCollection;
  protected readonly handler: DefaultTreeEventHandler;

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
}
