import { Observable } from 'rxjs';
import { FlatTreeItem } from '../classes/flat-tree-item.class';
import { TrackByFunction } from '@angular/core';

export interface TreeDataDisplayCollectionRef {
  readonly trackBy$: Observable<TrackByFunction<FlatTreeItem>>;
  readonly treeItemSizeRem$: Observable<number>;
  readonly scrollBehavior$: Observable<ScrollBehavior>;
  readonly data$: Observable<FlatTreeItem[]>;
  readonly selectedIdsList$: Observable<string[]>;
  readonly expandedIdsList$: Observable<string[]>;
  readonly hasDragAndDrop$: Observable<boolean>;
  readonly isLoading$: Observable<boolean>;

  setExpandedIdsList(value: string[]): void;
  setIsLoading(value: boolean): void;
  setData(data: FlatTreeItem[]): Observable<FlatTreeItem[]>;
  setSelectedIdsList(value: string[]): void;
}
