import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreeNodeProperties } from '@bimeister/pupakit.tree';

@Component({
  selector: 'demo-tree-node-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDemoExample4Component {
  public normalLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public selectedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
    forceHover: false,
  };

  public disabledLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
    forceHover: false,
  };
}
