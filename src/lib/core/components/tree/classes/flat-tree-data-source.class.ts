import { DataSource, ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem } from './flat-tree-item.class';

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  private readonly activeRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);
  private readonly disconnect$: Subject<void> = new Subject<void>();

  constructor(
    private readonly sortedData$: Observable<FlatTreeItem[]>,
    private readonly expandedItemsIds$: Observable<string[]>,
    private readonly treeControl: FlatTreeControl<FlatTreeItem>
  ) {
    super();
    this.expandedItemsIds$
      .pipe(
        map((expandedItemsIds: string[]) =>
          this.treeControl.expansionModel.selected.filter(
            (treeItem: FlatTreeItem) => !expandedItemsIds.includes(treeItem.id)
          )
        ),
        takeUntil(this.disconnect$)
      )
      .subscribe((itemsToCollapse: FlatTreeItem[]) => {
        return;
        itemsToCollapse.forEach((item: FlatTreeItem) => treeControl.collapseDescendants(item));
      });
  }

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([this.sortedData$, this.expandedItemsIds$]).pipe(
      map(([source, expandedItemsIds]: [FlatTreeItem[], string[]]) => {
        let lastCollapsedItemIndex: number = null;
        // tslint:disable-next-line: no-console
        console.log('before', source);
        type FlatTreeItemWithMarkers = FlatTreeItem & { __isCollapsed?: boolean; __isHidden?: boolean };

        const visibleTreeItems: FlatTreeItem[] = source
          .filter((item: FlatTreeItem) => !isNullOrUndefined(item))
          // tslint:disable-next-line: cyclomatic-complexity
          .reduce(
            // tslint:disable-next-line: cyclomatic-complexity
            (
              [previousItem, result]: [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[]],
              item: FlatTreeItem,
              index: number
            ): [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[]] => {
              const currentItemIsCollapsed: boolean = item.isExpandable && !expandedItemsIds.includes(item.id);

              const isFirstItem: boolean = Object.is(index, 0);
              const currentItemIsRoot: boolean = Object.is(item.level, 0);
              if (isFirstItem || currentItemIsRoot) {
                const itemToInsert: FlatTreeItemWithMarkers = currentItemIsCollapsed
                  ? { ...item, __isCollapsed: true }
                  : item;
                return [itemToInsert, [...result, itemToInsert]];
              }

              // tslint:disable-next-line: no-console
              console.log(previousItem);

              const previousItemIsParent: boolean =
                previousItem.isExpandable && Object.is(previousItem.level + 1, item.level);
              const parentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(previousItem);
              if (previousItemIsParent && parentIsCollapsed) {
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isHidden: true };
                return [itemToInsert, [...result, itemToInsert]];
              }
              if (previousItemIsParent && !parentIsCollapsed && currentItemIsCollapsed) {
                lastCollapsedItemIndex = index;
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isCollapsed: true };
                return [itemToInsert, [...result, itemToInsert]];
              }

              const previousItemIsSibling: boolean = Object.is(previousItem.level, item.level);
              const siblingIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
              if (previousItemIsSibling && siblingIsHidden) {
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isHidden: true };
                return [itemToInsert, [...result, itemToInsert]];
              }
              if (previousItemIsSibling && !siblingIsHidden && currentItemIsCollapsed) {
                lastCollapsedItemIndex = index;
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isCollapsed: true };
                return [itemToInsert, [...result, itemToInsert]];
              }

              const noElementsWereCollapsed: boolean = isNullOrUndefined(lastCollapsedItemIndex);
              if (noElementsWereCollapsed && !currentItemIsCollapsed) {
                const itemToInsert: FlatTreeItemWithMarkers = item;
                return [itemToInsert, [...result, itemToInsert]];
              }
              if (noElementsWereCollapsed && currentItemIsCollapsed) {
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isCollapsed: true };
                return [itemToInsert, [...result, itemToInsert]];
              }

              const lastCollapsedItem: FlatTreeItem = result[lastCollapsedItemIndex];
              const lastCollapsedItemIsParent: boolean =
                lastCollapsedItem.isExpandable &&
                FlatTreeDataSource.isCollapsed(lastCollapsedItem) &&
                Object.is(lastCollapsedItem.level + 1, item.level);
              if (lastCollapsedItemIsParent && !currentItemIsCollapsed) {
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isHidden: true };
                return [itemToInsert, [...result, itemToInsert]];
              }
              if (!lastCollapsedItemIsParent && currentItemIsCollapsed) {
                const itemToInsert: FlatTreeItemWithMarkers = { ...item, __isCollapsed: true };
                return [itemToInsert, [...result, itemToInsert]];
              }
              return [item, [...result, item]];
            },
            [null, []]
          )
          .filter((turplePart: FlatTreeItemWithMarkers | FlatTreeItemWithMarkers[]) => Array.isArray(turplePart))
          .flat()
          .filter((item: FlatTreeItem) => !isNullOrUndefined(item) && !FlatTreeDataSource.isHidden(item));
        // tslint:disable-next-line: no-console
        console.log('after', visibleTreeItems);
        return visibleTreeItems;
      }),
      withLatestFrom(this.activeRange$),
      map(([visibleSourceSection, range]: [FlatTreeItem[], ListRange]) =>
        isNullOrUndefined(range) ? visibleSourceSection : visibleSourceSection.slice(range.start, range.end)
      )
    );
  }

  public disconnect(): void {
    this.disconnect$.next();
  }

  public setRange(range: ListRange): void {
    this.activeRange$.next(range);
  }

  private static isCollapsed(item: FlatTreeItem): item is FlatTreeItem & { __isCollapsed: boolean } {
    return item.hasOwnProperty('__isCollapsed') && Boolean(item['__isCollapsed']);
  }

  private static isHidden(item: FlatTreeItem): item is FlatTreeItem & { __isHidden: boolean } {
    return item.hasOwnProperty('__isHidden') && Boolean(item['__isHidden']);
  }
}
