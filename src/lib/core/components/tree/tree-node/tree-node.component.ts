import { Component, Input } from '@angular/core';

import { TreeComponent, TreeItemNode } from '../tree.component';

@Component({
  selector: 'pupa-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  @Input() public item: TreeItemNode = null;

  constructor(private readonly treeComponent: TreeComponent) {}

  public clickItem(event: MouseEvent): void {
    event.stopPropagation();
    if (this.treeComponent.notActiveKeys.find(key => key === this.item.key) || !this.item.active) {
      return;
    }
    this.treeComponent.selectItemKey.emit(this.item.key);
  }

  public openChildren(event: MouseEvent): void {
    event.stopPropagation();
    this.item.opened = !this.item.opened;
  }
}
