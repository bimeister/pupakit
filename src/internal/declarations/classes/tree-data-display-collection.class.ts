import { BehaviorSubject } from 'rxjs';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { DataDisplayCollection } from './data-display-collection.class';
import { FlatTreeItem } from './flat-tree-item.class';

export class TreeDataDisplayCollection
  extends DataDisplayCollection<FlatTreeItem>
  implements TreeDataDisplayCollectionRef {
  public readonly expandedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly hasDragAndDrop$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public setExpandedIdsList(value: string[]): void {
    this.expandedIdsList$.next(value);
  }

  public setIsLoading(value: boolean): void {
    this.isLoading$.next(value);
  }
}
