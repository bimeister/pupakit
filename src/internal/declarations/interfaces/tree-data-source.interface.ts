import { ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface TreeDataSource {
  readonly currentSlice$: BehaviorSubject<FlatTreeItem[]>;
  readonly filteredData$: BehaviorSubject<FlatTreeItem[]>;
  readonly sortedData$: Observable<FlatTreeItem[]>;
  readonly expandedItemIds$: Observable<Set<string>>;
  readonly activeRange$: Observable<ListRange>;
  readonly hideRoot$: Observable<boolean>;
  readonly disconnect$: Subject<void>;

  connect(): Observable<FlatTreeItem[]>;
  disconnect(): void;
}
