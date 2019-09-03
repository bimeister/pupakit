import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export interface TreeItemNode {
  enable: boolean;
  key: string;
  value: string;
  icon: string;
  children: TreeItemNode[];
  parent: TreeItemNode;
  opened: boolean;
  active: boolean;
  changeDetector: ChangeDetectorRef;
}

@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent {
  @Input()
  public set items(items: any[]) {
    this._items = items;
    this.setTreeItemNodes();
  }

  @Input()
  public set notActiveKeys(keys: string[]) {
    this._notActiveKeys = keys;
    this.checkedActive();
  }

  public get notActiveKeys(): string[] {
    return this._notActiveKeys;
  }

  public get items(): any[] {
    return this._items;
  }

  @Input() public searchText: string = 'Поиск...';

  @Output()
  public selectItemKey: EventEmitter<string> = new EventEmitter<string>();

  public itemsNode: TreeItemNode[] = [];

  public _notActiveKeys: string[] = [];

  private readonly itemsCollection: Set<TreeItemNode> = new Set<TreeItemNode>();

  private _items: any[] = [];

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public valueChange(text: string): void {
    if (text === '') {
      this.itemsCollection.forEach(item => {
        item.enable = true;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
      });
      return;
    }
    const search: Set<TreeItemNode> = new Set<TreeItemNode>(
      Array.from(this.itemsCollection).filter(item => item.value.includes(text))
    );
    this.itemsCollection.forEach(item => {
      item.enable = false;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
    });
    search.forEach(item => {
      item.enable = true;
      item.opened = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
      this.openParent(item);
    });
    this.changeDetector.markForCheck();
  }

  private checkedActive(): void {
    this.itemsCollection.forEach(item => {
      item.active = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
    });
    this.itemsCollection.forEach(item => {
      if (!item.active) {
        return;
      }
      if (this.notActiveKeys.find(key => key === item.key)) {
        item.active = false;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
        if (item.children && item.children.length > 0) {
          this.checkedActiveItem(item.children);
        }
      }
    });
    this.changeDetector.markForCheck();
  }

  private checkedActiveItem(items: TreeItemNode[]): void {
    items
      .filter(item => item.active)
      .forEach(item => {
        item.active = false;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
        if (item.children && item.children.length > 0) {
          this.checkedActiveItem(item.children);
        }
      });
  }

  private openParent(item: TreeItemNode): void {
    if (item.parent !== null) {
      item.parent.enable = true;
      item.parent.opened = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
      this.openParent(item.parent);
    }
  }

  private setTreeItemNodes(): void {
    this.itemsCollection.clear();
    this.setTreeItemNode(this._items);
  }

  private setTreeItemNode(items: any[], parent: TreeItemNode = null): void {
    items.forEach(item => {
      if (!item.key || !item.value || !item.icon) {
        return;
      }
      const itemNode: TreeItemNode = {
        enable: true,
        key: item.key,
        value: item.value,
        icon: item.icon,
        children: [],
        parent,
        opened: false,
        active: true,
        changeDetector: null
      };
      if (parent !== null) {
        parent.children.push(itemNode);
      } else {
        this.itemsNode.push(itemNode);
      }
      this.itemsCollection.add(itemNode);
      if (item.children && item.children.length > 0) {
        this.setTreeItemNode(item.children, itemNode);
      }
    });
  }
}
