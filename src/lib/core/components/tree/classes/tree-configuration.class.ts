import { DataSource, ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';

import { FlatTreeItem } from './flat-tree-item.class';
import { TreeItem } from './tree-item.class';

export abstract class TreeConfiguration {
  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeConfiguration.getLevel,
    TreeConfiguration.isExpandable
  );

  public abstract dataSource: DataSource<FlatTreeItem>;

  constructor(
    public readonly dataOrigin$: Observable<TreeItem[]> | Observable<FlatTreeItem[]>,
    public readonly nodeTemplate: TemplateRef<any>,
    public readonly trackBy: TrackByFunction<FlatTreeItem>
  ) {}

  public getExpandedFlatTreeItems(): FlatTreeItem[] {
    return this.treeControl.expansionModel.selected;
  }

  public abstract updateVisibleRange(range: ListRange): void;

  protected static getLevel(node: FlatTreeItem): number {
    return node.level;
  }
  protected static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }
}
