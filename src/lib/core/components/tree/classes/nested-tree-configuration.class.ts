import { ListRange } from '@angular/cdk/collections';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FlatTreeItem } from './flat-tree-item.class';
import { NestedTreeDataSource } from './nested-tree-data-source.class';
import { TreeConfiguration } from './tree-configuration.class';
import { TreeItem } from './tree-item.class';

/** @deprecated unstable */
export class NestedTreeConfiguration extends TreeConfiguration {
  public dataSource: NestedTreeDataSource<TreeItem, FlatTreeItem> = new NestedTreeDataSource<TreeItem, FlatTreeItem>(
    this.treeControl,
    NestedTreeConfiguration.isExpandable,
    NestedTreeConfiguration.getLevel,
    NestedTreeConfiguration.toFlatConverter,
    NestedTreeConfiguration.getChildren,
    false,
    []
  );

  constructor(
    public readonly dataOrigin$: Observable<TreeItem[]>,
    public readonly nodeTemplate: TemplateRef<any> = null,
    public readonly trackBy: TrackByFunction<FlatTreeItem> = null
  ) {
    super(dataOrigin$, nodeTemplate, trackBy);
  }

  /** @deprecated unready */
  public updateVisibleRange(_range: ListRange): void {
    return;
  }

  private static toFlatConverter(node: TreeItem, level: number): FlatTreeItem {
    return new FlatTreeItem(
      Array.isArray(node.children) && !Object.is(node.children.length, 0),
      node.name,
      level,
      node.id
    );
  }

  private static getChildren(node: TreeItem): Observable<TreeItem[]> {
    return of(node.children);
  }
}
