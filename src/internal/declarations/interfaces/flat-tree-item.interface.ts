import { BaseTreeItem } from './base-tree-item.interface';

export interface FlatTreeItemInterface<T = any> extends BaseTreeItem<T> {
  level: number;
}
