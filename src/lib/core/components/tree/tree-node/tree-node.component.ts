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
    this.treeComponent.selectTreeItemNode.emit(this.item);
  }

  public openChildren(event: MouseEvent): void {
    event.stopPropagation();
    this.item.opened = !this.item.opened;
  }
}
