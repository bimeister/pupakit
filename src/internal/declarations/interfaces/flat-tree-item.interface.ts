import { TreeItem } from './tree-item.interface';
import { BaseTreeItem } from './base-tree-item.interface';

export interface FlatTreeItem<T> extends BaseTreeItem<T> {
  level: number;
}
