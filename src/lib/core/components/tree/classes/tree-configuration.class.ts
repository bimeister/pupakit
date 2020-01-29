import { DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Observable } from 'rxjs';

import { FlatTreeItem } from './flat-tree-item.class';
import { TreeItem } from './tree-item.class';

export abstract class TreeConfiguration {
  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeConfiguration.getLevel,
    TreeConfiguration.isExpandable
  );

  public abstract dataSource: DataSource<FlatTreeItem>;

  constructor(protected readonly dataOrigin: Observable<TreeItem[]> | Observable<FlatTreeItem[]>) {}

  public abstract setSourceData(data: TreeItem[] | FlatTreeItem[]): void;
  public abstract getSourceData(): Observable<TreeItem[]> | Observable<FlatTreeItem[]>;

  public getExpandedFlatTreeItems(): FlatTreeItem[] {
    return this.treeControl.expansionModel.selected;
  }

  protected static getLevel(node: FlatTreeItem): number {
    return node.level;
  }
  protected static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }
}
