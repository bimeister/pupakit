import { FlatTreeItem } from '../classes/flat-tree-item.class';

export interface TreeItemTemplateContext<T> {
  $implicit: FlatTreeItem<T>;
}
