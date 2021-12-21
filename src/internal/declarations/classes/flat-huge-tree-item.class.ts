import { FlatTreeItem } from './flat-tree-item.class';

export class FlatHugeTreeItem<T = any> extends FlatTreeItem<T> {
  public parentItemId: string;
  constructor(
    isExpandable: boolean,
    name: string,
    level: number,
    id: string,
    parentItemId: string,
    originalData: T = null,
    isElement: boolean = false
  ) {
    super(isExpandable, name, level, id, originalData, isElement);
    this.parentItemId = parentItemId;
  }
}
