import { HugeTreeItem } from '../interfaces/huge-tree-item.interface';

export class FlatHugeTreeItem implements HugeTreeItem {
  constructor(
    public entityId: string,
    public parentEntityId: string,
    public entityValue: string,
    public level: number
  ) {}
}
