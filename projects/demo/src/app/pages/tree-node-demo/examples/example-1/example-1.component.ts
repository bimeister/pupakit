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
    forceHover: false,
  };

  public normalLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public normalLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public selectedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
    forceHover: false,
  };

  public selectedLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
    forceHover: false,
  };

  public selectedLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: false,
    forceHover: false,
  };

  public disabledLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
    forceHover: false,
  };

  public disabledLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
    forceHover: false,
  };

  public disabledLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: true,
    forceHover: false,
  };

  public selectedDisabledLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
    forceHover: false,
  };

  public selectedDisabledLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
    forceHover: false,
  };

  public selectedDisabledLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: false,
    isSelected: true,
    isDisabled: true,
    forceHover: false,
  };

  public loadingLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public loadingLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public loadingLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: true,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public withoutChildrenLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public withoutChildrenLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public withoutChildrenLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public expandedLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public expandedLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public expandedLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: true,
    isLoading: false,
    hasChildren: true,
    isExpanded: true,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public notDirectoryLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public notDirectoryLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public notDirectoryLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: false,
  };

  public forceHoverLevel0TreeNodeProperties: TreeNodeProperties = {
    level: 0,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: true,
  };

  public forceHoverLevel1TreeNodeProperties: TreeNodeProperties = {
    level: 1,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: true,
  };

  public forceHoverLevel2TreeNodeProperties: TreeNodeProperties = {
    level: 2,
    isDirectory: false,
    isLoading: false,
    hasChildren: false,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    forceHover: true,
  };
}
