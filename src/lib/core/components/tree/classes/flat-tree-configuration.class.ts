import { Observable, of } from 'rxjs';

import { FlatDataSource } from './flat-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeConfiguration } from './tree-configuration.class';

export class FlatTreeConfiguration extends TreeConfiguration {
  public dataSource: FlatDataSource<FlatTreeItem, FlatTreeItem> = new FlatDataSource<FlatTreeItem, FlatTreeItem>(
    this.treeControl,
    FlatTreeConfiguration.isExpandable,
    FlatTreeConfiguration.getLevel,
    FlatTreeConfiguration.toFlatConverter,
    FlatTreeConfiguration.getChildren,
    true,
    []
  );

  constructor(protected readonly dataOrigin: Observable<FlatTreeItem[]>) {
    super(dataOrigin);
  }

  public setSourceData(data: FlatTreeItem[]): void {
    this.dataSource.setData(data);
  }

  public getSourceData(): Observable<FlatTreeItem[]> {
    return this.dataOrigin;
  }

  private static toFlatConverter(node: FlatTreeItem, _: number): FlatTreeItem {
    return node;
  }

  private static getChildren(_: FlatTreeItem): Observable<FlatTreeItem[]> {
    return of([]);
  }
}
