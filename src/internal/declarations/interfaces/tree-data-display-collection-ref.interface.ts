import { Observable } from 'rxjs';
import { DataDisplayCollectionRef } from './data-display-collection-ref.interface';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface TreeDataDisplayCollectionRef extends DataDisplayCollectionRef<FlatTreeItem> {
  readonly expandedIdsList$: Observable<string[]>;
  readonly hasDragAndDrop$: Observable<boolean>;
  readonly isLoading$: Observable<boolean>;

  setExpandedIdsList(value: string[]): void;
  setIsLoading(value: boolean): void;
}
