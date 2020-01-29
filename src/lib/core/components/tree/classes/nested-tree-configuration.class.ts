import { MatTreeFlattener } from '@angular/material/tree';
import { Observable, of } from 'rxjs';

import { FlatDataSource } from './flat-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeConfiguration } from './tree-configuration.class';
import { TreeItem } from './tree-item.class';

export class NestedTreeConfiguration extends TreeConfiguration {
  private readonly treeFlattener: MatTreeFlattener<TreeItem, FlatTreeItem> = new MatTreeFlattener(
    NestedTreeConfiguration.toFlatConverter,
    NestedTreeConfiguration.getLevel,
    NestedTreeConfiguration.isExpandable,
    NestedTreeConfiguration.getChildren
  );

  public dataSource: FlatDataSource<TreeItem, FlatTreeItem> = new FlatDataSource<TreeItem, FlatTreeItem>(
    this.treeControl,
    this.treeFlattener,
    []
  );

  constructor(protected readonly dataOrigin: Observable<TreeItem[]>) {
    super(dataOrigin);
  }

  public setSourceData(data: TreeItem[]): void {
    this.dataSource.setData(data);
  }

  public getSourceData(): Observable<TreeItem[]> {
    return this.dataOrigin;
  }

  private static toFlatConverter(node: TreeItem, level: number): FlatTreeItem {
    return new FlatTreeItem(Array.isArray(node.children) && !Object.is(node.children.length, 0), node.name, level);
  }

  private static getChildren(node: TreeItem): Observable<TreeItem[]> {
    return of(node.children);
  }
}
