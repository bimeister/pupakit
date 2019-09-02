import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export interface TreeItem {
  key: string;
  value: string;
  icon: string;
  children: TreeItem[];
}

export interface TreeItemNode {
  enable: boolean;
  key: string;
  value: string;
  icon: string;
  children: TreeItemNode[];
  parent: TreeItemNode;
  opened: boolean;
}

@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {
  @Input()
  public set items(items: TreeItem[]) {
    this._items = items;
    this.setTreeItemNodes();
  }

  public get items(): TreeItem[] {
    return this._items;
  }

  @Input() public searchText: string = 'Поиск...';

  @Output()
  public selectTreeItemNode: EventEmitter<TreeItemNode> = new EventEmitter<TreeItemNode>();

  public itemsNode: TreeItemNode[] = [];

  private readonly itemsCollection: Set<TreeItemNode> = new Set<TreeItemNode>();

  private _items: TreeItem[] = [];

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public valueChange(text: string): void {
    if (text === '') {
      this.itemsCollection.forEach(item => {
        item.enable = true;
      });
      return;
    }
    const search: Set<TreeItemNode> = new Set<TreeItemNode>(
      Array.from(this.itemsCollection).filter(item => item.value.includes(text))
    );
    this.itemsCollection.forEach(item => {
      item.enable = false;
    });
    search.forEach(item => {
      item.enable = true;
      item.opened = true;
      this.openParent(item);
    });
    this.changeDetector.markForCheck();
  }

  private openParent(item: TreeItemNode): void {
    if (item.parent !== null) {
      item.parent.enable = true;
      item.parent.opened = true;
      this.openParent(item.parent);
    }
  }

  private setTreeItemNodes(): void {
    this.itemsCollection.clear();
    this.setTreeItemNode(this._items);
  }

  private setTreeItemNode(items: TreeItem[], parent: TreeItemNode = null): void {
    items.forEach(item => {
      const itemNode: TreeItemNode = {
        enable: true,
        key: item.key,
        value: item.value,
        icon: item.icon,
        children: [],
        parent,
        opened: false
      };
      if (parent !== null) {
        parent.children.push(itemNode);
      } else {
        this.itemsNode.push(itemNode);
      }
      this.itemsCollection.add(itemNode);
      if (item.children.length > 0) {
        this.setTreeItemNode(item.children, itemNode);
      }
    });
  }
}
