import { DataSource, ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FlatTreeItem } from './flat-tree-item.class';
import { TreeItem } from './tree-item.class';

export abstract class TreeConfiguration {
  public readonly itemToExpand$: BehaviorSubject<FlatTreeItem> = new BehaviorSubject<FlatTreeItem>(null);
  public readonly expandedItemsIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

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

  public markAsCollapsed(node: FlatTreeItem): void {
    this.expandedItemsIds$
      .pipe(
        take(1),
        map((expandedItemsIds: string[]) => expandedItemsIds.filter((itemId: string) => itemId !== node.id)),
        map((updatedExpandedItemsIds: string[]) => new Set<string>(updatedExpandedItemsIds)),
        map((updatedExpandedItemsIdsSet: Set<string>) => Array.from(updatedExpandedItemsIdsSet.values()))
      )
      .subscribe((expandedItemsIds: string[]) => this.expandedItemsIds$.next(expandedItemsIds));
  }

  public markAsExpanded(node: FlatTreeItem): void {
    this.itemToExpand$.next(node);
    this.expandedItemsIds$
      .pipe(
        take(1),
        map((expandedItemsIds: string[]) => [...expandedItemsIds, node.id]),
        map((updatedExpandedItemsIds: string[]) => new Set<string>(updatedExpandedItemsIds)),
        map((updatedExpandedItemsIdsSet: Set<string>) => Array.from(updatedExpandedItemsIdsSet.values()))
      )
      .subscribe((expandedItemsIds: string[]) => this.expandedItemsIds$.next(expandedItemsIds));
  }

  public abstract updateVisibleRange(range: ListRange): void;

  protected static getLevel(node: FlatTreeItem): number {
    return node.level;
  }
  protected static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }
}
