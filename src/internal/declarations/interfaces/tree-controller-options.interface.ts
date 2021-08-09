import { ControllerOptions } from './controller-options.interface';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface TreeControllerOptions extends ControllerOptions<FlatTreeItem> {
  hasDragAndDrop?: boolean;
}
