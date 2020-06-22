import { BaseTreeItem } from './base-tree-item.interface';

export interface TreeItem<T> extends BaseTreeItem<T> {
  parentId: string | null;
}
