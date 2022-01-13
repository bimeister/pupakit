export class ExpandedTreeItem {
  public parentTreeItem: ExpandedTreeItem;
  public readonly childrenTreeItemsMap: Map<string, ExpandedTreeItem> = new Map<string, ExpandedTreeItem>();
  constructor(public readonly id: string) {}

  public setParent(parent: NonNullable<ExpandedTreeItem>): void {
    if (this.parentTreeItem?.id === parent?.id) {
      return;
    }
    this.parentTreeItem = parent;

    parent.setChild(this);
  }

  public setChild(child: NonNullable<ExpandedTreeItem>): void {
    if (this.childrenTreeItemsMap.has(child?.id)) {
      return;
    }
    this.childrenTreeItemsMap.set(child.id, child);

    child.setParent(this);
  }

  public getAllChildrenIds(): string[] {
    return this.getAllNestedChildrenIds(this.childrenTreeItemsMap);
  }

  private getAllNestedChildrenIds(treeItemsMap: Map<string, ExpandedTreeItem>, childrenIds: string[] = []): string[] {
    if (treeItemsMap.size === 0) {
      return childrenIds;
    }

    const updatedChildrenIds: string[] = childrenIds.concat(Array.from(treeItemsMap.keys()));
    const childrenIdsSections: string[][] = Array.from(treeItemsMap.values()).map((treeItem: ExpandedTreeItem) =>
      this.getAllNestedChildrenIds(treeItem.childrenTreeItemsMap, updatedChildrenIds)
    );
    return childrenIdsSections.flat(1);
  }
}
