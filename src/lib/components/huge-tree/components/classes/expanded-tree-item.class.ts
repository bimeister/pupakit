export class ExpandedTreeItem {
  public readonly id: string;
  public parentTreeItem: ExpandedTreeItem;
  public childTreeItem: ExpandedTreeItem;
  constructor(id: string) {
    this.id = id;
  }

  public setParent(parent: NonNullable<ExpandedTreeItem>): void {
    if (this.parentTreeItem?.id === parent?.id) {
      return;
    }
    this.parentTreeItem = parent;

    parent.setChild(this);
  }

  public setChild(child: NonNullable<ExpandedTreeItem>): void {
    if (this.childTreeItem?.id === child?.id) {
      return;
    }
    this.childTreeItem = child;

    child.setParent(this);
  }

  public getAllParentIds(): string[] {
    const parentIds: string[] = [];

    let incomingParent: ExpandedTreeItem | undefined = this.parentTreeItem;
    do {
      if (incomingParent === undefined) {
        break;
      }
      parentIds.push(incomingParent.id);
      incomingParent = incomingParent.parentTreeItem;
    } while (incomingParent !== undefined);

    return parentIds;
  }

  public getAllChildrenIds(): string[] {
    const childrenIds: string[] = [];

    let incomingChild: ExpandedTreeItem | undefined = this.childTreeItem;
    do {
      if (incomingChild === undefined) {
        break;
      }
      childrenIds.push(incomingChild.id);
      incomingChild = incomingChild.childTreeItem;
    } while (incomingChild !== undefined);

    return childrenIds;
  }
}
