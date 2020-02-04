import { DataSource, ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem } from './flat-tree-item.class';

type FlatTreeItemWithMarkers = FlatTreeItem & { __isCollapsed?: boolean; __isHidden?: boolean };

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  private readonly activeRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);
  private readonly disconnect$: Subject<void> = new Subject<void>();

  public readonly currentSlice$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);
  public readonly filteredData$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);

  constructor(
    private readonly sortedData$: Observable<FlatTreeItem[]>,
    private readonly expandedItemsIds$: Observable<string[]>
  ) {
    super();
  }

  public setRange(range: ListRange): void {
    this.activeRange$.next(range);
  }

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([
      this.activeRange$.pipe(
        filter((range: ListRange) => !isNullOrUndefined(range) && range.start >= 0 && range.end >= 0)
      ),
      this.sortedData$,
      this.expandedItemsIds$
    ]).pipe(
      map(([range, source, expandedItemsIds]: [ListRange, FlatTreeItem[], string[]]) => [
        FlatTreeDataSource.filterNotHiddenItems(source, expandedItemsIds),
        range
      ]),
      tap(([filteredData, _]: [FlatTreeItem[], ListRange]) => this.filteredData$.next(filteredData)),
      map(([visibleSourceSection, range]: [FlatTreeItem[], ListRange]) =>
        isNullOrUndefined(range) ? visibleSourceSection : visibleSourceSection.slice(range.start, range.end)
      ),
      tap((currentSlice: FlatTreeItem[]) => this.currentSlice$.next(currentSlice))
    );
  }

  public disconnect(): void {
    this.disconnect$.next();
  }

  private static isExpandable(item: FlatTreeItem): item is FlatTreeItem & { isExpandable: true } {
    return !isNullOrUndefined(item) && item.isExpandable;
  }

  private static isCollapsed(
    item: FlatTreeItem,
    expandedItemsIds: string[]
  ): item is FlatTreeItem & { __isCollapsed: boolean } {
    const itemIsCollapsedManualy: boolean = item.hasOwnProperty('__isCollapsed') && Boolean(item['__isCollapsed']);
    const itemIsNotExpanded: boolean = !expandedItemsIds.includes(item.id);
    return FlatTreeDataSource.isExpandable(item) && (itemIsCollapsedManualy || itemIsNotExpanded);
  }

  private static isHidden(item: FlatTreeItem): item is FlatTreeItem & { __isHidden: boolean } {
    return item.hasOwnProperty('__isHidden') && Boolean(item['__isHidden']);
  }

  private static processExpandableItem(
    previousItem: FlatTreeItemWithMarkers,
    currentItem: FlatTreeItemWithMarkers,
    currentItemIndex: number,
    currentResult: FlatTreeItemWithMarkers[],
    expandedItemsIds: string[]
  ): {
    previousItem: FlatTreeItemWithMarkers;
    currentResult: FlatTreeItemWithMarkers[];
  } {
    const currentItemIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(currentItem, expandedItemsIds);

    const currentItemIsRoot: boolean = Object.is(currentItem.level, 0);
    if (currentItemIsRoot) {
      const itemToInsert: FlatTreeItemWithMarkers = { ...currentItem, __isCollapsed: currentItemIsCollapsed };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }

    const previousItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(previousItem) && Object.is(previousItem.level + 1, currentItem.level);
    const parentIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    const parentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(previousItem, expandedItemsIds);
    if (previousItemIsParent && (parentIsHidden || parentIsCollapsed)) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }
    if (previousItemIsParent && !parentIsHidden && !parentIsCollapsed) {
      const itemToInsert: FlatTreeItemWithMarkers = { ...currentItem, __isCollapsed: currentItemIsCollapsed };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }

    const previousItemIsSibling: boolean = Object.is(previousItem.level, currentItem.level);
    const siblingIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    if (previousItemIsSibling) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: siblingIsHidden,
        __isCollapsed: currentItemIsCollapsed
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }

    const farParentItem: FlatTreeItem = currentResult
      .slice(0, currentItemIndex)
      .reverse()
      .find(
        (item: FlatTreeItem) => FlatTreeDataSource.isExpandable(item) && Object.is(item.level + 1, currentItem.level)
      );
    const farParentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(farParentItem, expandedItemsIds);
    const farParentIsHidden: boolean = FlatTreeDataSource.isHidden(farParentItem);
    if (farParentIsCollapsed || farParentIsHidden) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }
    const unProcessedItem: FlatTreeItemWithMarkers = {
      ...currentItem,
      __isCollapsed: FlatTreeDataSource.isCollapsed(currentItem, expandedItemsIds)
    };
    return {
      previousItem: unProcessedItem,
      currentResult: [...currentResult, unProcessedItem]
    };
  }

  private static processNonExpandableItem(
    previousItem: FlatTreeItemWithMarkers,
    currentItem: FlatTreeItemWithMarkers,
    currentItemIndex: number,
    currentResult: FlatTreeItemWithMarkers[],
    expandedItemsIds: string[]
  ): {
    previousItem: FlatTreeItemWithMarkers;
    currentResult: FlatTreeItemWithMarkers[];
  } {
    const currentItemIsRoot: boolean = Object.is(currentItem.level, 0);
    if (currentItemIsRoot) {
      return {
        previousItem: currentItem,
        currentResult: [...currentResult, currentItem]
      };
    }

    const previousItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(previousItem) && Object.is(previousItem.level + 1, currentItem.level);
    const parentIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    const parentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(previousItem, expandedItemsIds);
    if (previousItemIsParent && (parentIsHidden || parentIsCollapsed)) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }
    if (previousItemIsParent && !parentIsHidden && !parentIsCollapsed) {
      return {
        previousItem: currentItem,
        currentResult: [...currentResult, currentItem]
      };
    }

    const previousItemIsSibling: boolean = Object.is(previousItem.level, currentItem.level);
    const siblingIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    if (previousItemIsSibling) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: siblingIsHidden
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }

    const farParentItem: FlatTreeItem = currentResult
      .slice(0, currentItemIndex)
      .reverse()
      .find(
        (item: FlatTreeItem) => FlatTreeDataSource.isExpandable(item) && Object.is(item.level + 1, currentItem.level)
      );
    const farParentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(farParentItem, expandedItemsIds);
    const farParentIsHidden: boolean = FlatTreeDataSource.isHidden(farParentItem);
    if (farParentIsCollapsed || farParentIsHidden) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }
    return {
      previousItem: currentItem,
      currentResult: [...currentResult, currentItem]
    };
  }

  private static filterNotHiddenItems(source: FlatTreeItem[], expandedItemsIds: string[]): FlatTreeItem[] {
    const visibleTreeItems: FlatTreeItem[] = source
      .filter((item: FlatTreeItem) => !isNullOrUndefined(item))
      .reduce(
        (
          [previousItem, result]: [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[]],
          item: FlatTreeItem,
          index: number
        ): [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[]] => {
          if (FlatTreeDataSource.isExpandable(item)) {
            const expandableItemData: {
              previousItem: FlatTreeItemWithMarkers;
              currentResult: FlatTreeItemWithMarkers[];
            } = FlatTreeDataSource.processExpandableItem(previousItem, item, index, result, expandedItemsIds);
            return [expandableItemData.previousItem, expandableItemData.currentResult];
          }

          const nonExpandableItemData: {
            previousItem: FlatTreeItemWithMarkers;
            currentResult: FlatTreeItemWithMarkers[];
          } = FlatTreeDataSource.processNonExpandableItem(previousItem, item, index, result, expandedItemsIds);
          return [nonExpandableItemData.previousItem, nonExpandableItemData.currentResult];
        },
        [null, []]
      )
      .filter((turplePart: FlatTreeItemWithMarkers | FlatTreeItemWithMarkers[] | number) => Array.isArray(turplePart))
      .flat()
      .filter((item: FlatTreeItem) => !isNullOrUndefined(item) && !FlatTreeDataSource.isHidden(item));
    return visibleTreeItems;
  }
}
