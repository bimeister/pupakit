import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { ChipSelectTreeComponent, TreeItemNode } from '../chip-select-tree/chip-select-tree.component';

@Component({
  selector: 'pupa-chip-select-tree-node',
  templateUrl: './chip-select-tree-node.component.html',
  styleUrls: ['./chip-select-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipSelectTreeNodeComponent {
  @Input()
  public set item(item: TreeItemNode) {
    this._item = item;
    this._item.changeDetector = this.changeDetector;
  }

  public get item(): TreeItemNode {
    return this._item;
  }

  private _item: TreeItemNode = null;

  constructor(
    private readonly treeComponent: ChipSelectTreeComponent,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  public clickItem(event: MouseEvent): void {
    event.stopPropagation();
    if (
      !this.item.clickable ||
      this.treeComponent.notActiveKeys.find(key => key === this.item.key) ||
      !this.item.active
    ) {
      return;
    }
    this.treeComponent.selectItemKey.emit(this.item.key);
  }

  public openChildren(event: MouseEvent): void {
    event.stopPropagation();
    this.item.opened = !this.item.opened;
  }
}
