import { FlatTreeItemInterface } from '../interfaces/flat-tree-item.interface';

/**
 * todo: maybe drop one property – isExpandable or isElement
 * */
export class FlatTreeItem<T = any> implements FlatTreeItemInterface<T> {
  constructor(
    public readonly isExpandable: boolean,
    public name: string,
    public level: number,
    public id: string,
    public originalData: T = null,
    public isElement: boolean = false
  ) {}
}
