import { ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';

export interface TreeManipulatorConfiguration {
  readonly dataOrigin$: Observable<FlatTreeItem[]>;
  readonly selectedNodesIds$: Observable<string[]>;
  readonly scrollByRoute$: Observable<string[]>;
  readonly nodeTemplate: TemplateRef<any>;
  readonly trackBy: TrackByFunction<FlatTreeItem>;
}

export abstract class TreeManipulator {
  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);
  public readonly dataOrigin$: Observable<FlatTreeItem[]> = this.configuration.dataOrigin$.pipe(shareReplay(1));
  public readonly selectedNodesIds$: Observable<string[]> = this.configuration.selectedNodesIds$.pipe(shareReplay(1));
  public readonly scrollByRoute$: Observable<string[]> = this.configuration.scrollByRoute$.pipe(shareReplay(1));
  public readonly nodeTemplate: TemplateRef<any> = this.configuration.nodeTemplate;
  public readonly trackBy: TrackByFunction<FlatTreeItem> = this.configuration.trackBy;

  public readonly itemToExpand$: BehaviorSubject<FlatTreeItem> = new BehaviorSubject<FlatTreeItem>(null);
  public readonly expandedItemsIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeManipulator.getLevel,
    TreeManipulator.isExpandable
  );

  public abstract dataSource: FlatTreeDataSource;

  constructor(protected readonly configuration: TreeManipulatorConfiguration) {}

  public getExpandedFlatTreeItems(): FlatTreeItem[] {
    return this.treeControl.expansionModel.selected;
  }

  public markAsCollapsed(node: FlatTreeItem): void {
    if (isNullOrUndefined(node)) {
      return;
    }
    this.expandedItemsIds$
      .pipe(
        take(1),
        map((expandedItemsIds: string[]) => (Array.isArray(expandedItemsIds) ? expandedItemsIds : [])),
        map((expandedItemsIds: string[]) => expandedItemsIds.filter((itemId: string) => itemId !== node.id)),
        map((updatedExpandedItemsIds: string[]) => new Set<string>(updatedExpandedItemsIds)),
        map((updatedExpandedItemsIdsSet: Set<string>) => Array.from(updatedExpandedItemsIdsSet.values()))
      )
      .subscribe((expandedItemsIds: string[]) => this.expandedItemsIds$.next(expandedItemsIds));
  }

  public markAsExpanded(node: FlatTreeItem): void {
    if (isNullOrUndefined(node)) {
      return;
    }
    this.itemToExpand$.next(node);
    this.markIdAsExpanded(node.id);
  }

  public markIdAsExpanded(nodeId: string): void {
    this.expandedItemsIds$
      .pipe(
        take(1),
        map((expandedItemsIds: string[]) => (Array.isArray(expandedItemsIds) ? expandedItemsIds : [])),
        map((expandedItemsIds: string[]) => [...expandedItemsIds, nodeId]),
        map((updatedExpandedItemsIds: string[]) => new Set<string>(updatedExpandedItemsIds)),
        map((updatedExpandedItemsIdsSet: Set<string>) => Array.from(updatedExpandedItemsIdsSet.values()))
      )
      .subscribe((expandedItemsIds: string[]) => this.expandedItemsIds$.next(expandedItemsIds));
  }

  public updateVisibleRange(range: ListRange): void {
    this.listRange$.next(range);
  }

  protected static getLevel(node: FlatTreeItem): number {
    return node.level;
  }
  protected static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }
}
