import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreeNodeProperties } from '@bimeister/pupakit.tree';

@Component({
  selector: 'demo-tree-node-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDemoExample1Component {
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

  public selectedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
  };

  public selectedLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
  };

  public selectedLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
  };

  public disabledLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
  };

  public disabledLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
  };

  public disabledLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
  };

  public selectedDisabledLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
  };

  public selectedDisabledLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
  };

  public selectedDisabledLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
  };

  public loadingLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public loadingLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public loadingLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public withoutChildrenLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public withoutChildrenLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public withoutChildrenLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public expandedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
  };

  public expandedLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
  };

  public expandedLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
  };

  public notDirectoryLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public notDirectoryLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };

  public notDirectoryLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
  };
}
