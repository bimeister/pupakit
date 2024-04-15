import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { TreeNodeActionsDirective } from '../../directives/tree-node-actions.directive';
import { TreeNodeProperties } from '../../../../declarations/interfaces/tree-node-properties.interface';
import { isNil } from '@bimeister/utilities';
import { TREE_NODE_OFFSET_REM } from '../../../../declarations/constants/tree-node-offset-rem.const';

@Component({
  selector: 'pupa-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent {
  @Input() public treeNodeProperties: TreeNodeProperties;
  @ContentChild(TreeNodeActionsDirective) public readonly treeNodeActionsTemplate: TreeNodeActionsDirective;

  public get arrowIcon(): string {
    if (this.treeNodeProperties.isExpanded) {
      return 'app-chevron-down';
    }
    return 'app-chevron-right';
  }

  public get arrowOffset(): string {
    return `${this.treeNodeProperties.level * TREE_NODE_OFFSET_REM}rem`;
  }

  public get isSelected(): boolean {
    return this.treeNodeProperties.isSelected || this.treeNodeProperties.isHighlighted;
  }

  public expand(event: Event): void {
    event.stopPropagation();
    if (isNil(this.treeNodeProperties.expand)) {
      return;
    }
    this.treeNodeProperties.expand();
  }
}
