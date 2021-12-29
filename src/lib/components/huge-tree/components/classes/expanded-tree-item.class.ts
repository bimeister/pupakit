export class ExpandedTreeItem {
  public readonly id: string;
  public parentTreeItem: ExpandedTreeItem;
  public readonly childrenTreeItemsMap: Map<string, ExpandedTreeItem> = new Map<string, ExpandedTreeItem>();
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
    if (this.childrenTreeItemsMap.has(child?.id)) {
      return;
    }
    this.childrenTreeItemsMap.set(child.id, child);

    child.setParent(this);
  }

  public getAllChildrenIds(): string[] {
    const neededIds: string[] = [];

    if (this.childrenTreeItemsMap.size > 0) {
      const pushChildrenIds: (childrenIds: string[], treeItemsMap: Map<string, ExpandedTreeItem>) => void = (
        childrenIds: string[],
        treeItemsMap: Map<string, ExpandedTreeItem>
      ) => {
        if (treeItemsMap.size === 0) {
          return;
        }

        const childChildrenIds: string[] = Array.from(treeItemsMap.keys());
        childrenIds.push(...childChildrenIds);

        treeItemsMap.forEach((treeItem: ExpandedTreeItem) =>
          pushChildrenIds(childrenIds, treeItem.childrenTreeItemsMap)
        );
      };

      pushChildrenIds(neededIds, this.childrenTreeItemsMap);
    }

    return neededIds;
  }
}
