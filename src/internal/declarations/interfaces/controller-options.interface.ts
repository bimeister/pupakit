import { TrackByFunction } from '@angular/core';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface ControllerOptions {
  hasDragAndDrop?: boolean;
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<FlatTreeItem>;
}
