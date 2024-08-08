import { FlatTreeItem } from '../classes/flat-tree-item.class';
import { TrackByFunction } from '@angular/core';

export interface TreeControllerOptions {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<FlatTreeItem>;
  hasDragAndDrop?: boolean;
  treeItemSizeRem?: number;
}
