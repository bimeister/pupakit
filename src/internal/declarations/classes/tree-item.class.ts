import { TreeItem as TreeItemInterface } from './../interfaces/tree-item.interface';

export class TreeItem<T = any> implements TreeItemInterface<T> {
  constructor(
    public readonly isExpandable: boolean,
    public name: string,
    public id: string,
    public parentId: string | null,
    public originalData: T = null,
    public readonly isElement: boolean = false
  ) {}
}
