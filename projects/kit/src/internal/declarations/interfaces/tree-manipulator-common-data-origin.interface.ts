import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

import { TreeType } from '../enums/tree-type.enum';

export interface TreeManipulatorCommonDataOrigin {
  readonly type?: TreeType;
  readonly nodeTemplate?: Observable<TemplateRef<any>>;
  readonly hasDragAndDrop?: Observable<boolean>;
  readonly nodesWithoutPadding?: Observable<boolean>;
  readonly scrollBehavior?: Observable<ScrollBehavior>;
  readonly trackBy?: Observable<TrackByFunction<FlatTreeItem>>;
  readonly hideRoot: Observable<boolean>;
  readonly isLoading?: Observable<boolean>;
  readonly scrollByRoute?: Observable<string[]>;
  readonly highlightedNodesIds?: Observable<string[]>;
  readonly selectedNodesIds?: Observable<string[]>;
}
