import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreeNodeProperties } from '@bimeister/pupakit.tree';

@Component({
  selector: 'demo-tree-node-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDemoExample2Component {
  public normalLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public normalLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public normalLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public normalLevel3TreeNodeProperties: TreeNodeProperties = {
    level: 3,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public normalLevel4TreeNodeProperties: TreeNodeProperties = {
    level: 4,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public normalLevel5TreeNodeProperties: TreeNodeProperties = {
    level: 5,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public selectedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
  };
}
