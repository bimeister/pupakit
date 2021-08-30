import { TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface DataDisplayCollectionRef {
  readonly trackBy$: Observable<TrackByFunction<FlatTreeItem>>;
  readonly scrollBehavior$: Observable<ScrollBehavior>;
  readonly data$: Observable<FlatTreeItem[]>;
  readonly selectedIdsList$: Observable<string[]>;
  readonly hasDragAndDrop$: Observable<boolean>;
  readonly isLoading$: Observable<boolean>;

  setData(data: FlatTreeItem[]): Observable<FlatTreeItem[]>;
  setSelectedIdsList(value: string[]): void;
  setIsLoading(value: boolean): void;
}
