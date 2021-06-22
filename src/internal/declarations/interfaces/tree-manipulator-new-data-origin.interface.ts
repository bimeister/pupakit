import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface TreeManipulatorNewDataOrigin {
  readonly fetchOnCreate?: boolean;
  readonly nodeTemplate?: Observable<TemplateRef<unknown>>;
  readonly hasDragAndDrop?: Observable<boolean>;
  readonly nodesWithoutPadding?: Observable<boolean>;
  readonly scrollBehavior?: Observable<ScrollBehavior>;
  readonly trackBy?: Observable<TrackByFunction<FlatTreeItem>>;
  readonly hideRoot?: Observable<boolean>;
  readonly isLoading?: Observable<boolean>;
  readonly scrollByRoute?: Observable<string[]>;
  readonly highlightedNodesIds?: Observable<string[]>;
  readonly selectedNodesIds?: Observable<string[]>;
  fetchChildrenFunction(parentId: string): Observable<FlatTreeItem[]>;
}
