import { BaseTreeItem } from './base-tree-item.interface';

export interface TreeItemInterface<T = any> extends BaseTreeItem<T> {
  parentId: string | null;
}
