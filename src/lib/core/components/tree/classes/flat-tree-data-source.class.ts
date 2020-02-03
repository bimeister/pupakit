import { DataSource, ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem } from './flat-tree-item.class';

type FlatTreeItemWithMarkers = FlatTreeItem & { __isCollapsed?: boolean; __isHidden?: boolean };

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  private readonly activeRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);
  private readonly disconnect$: Subject<void> = new Subject<void>();
  private readonly lastCollapsedItemIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly data$: Observable<FlatTreeItem[]> = this.activeRange$.pipe(
    switchMapTo(combineLatest([this.sortedData$, this.expandedItemsIds$])),
    withLatestFrom(this.lastCollapsedItemIndex$),
    map(([[source, expandedItemsIds], previouslySavedLastCollapsedItemIndex]: [[FlatTreeItem[], string[]], number]) =>
      FlatTreeDataSource.filterNotHiddenItems(source, expandedItemsIds, previouslySavedLastCollapsedItemIndex)
    ),
    withLatestFrom(this.activeRange$),
    map(([visibleSourceSection, range]: [FlatTreeItem[], ListRange]) =>
      isNullOrUndefined(range) ? visibleSourceSection : visibleSourceSection.slice(range.start, range.end)
    )
  );

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
    return this.data$;
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
    expandedItemsIds: string[],
    lastCollapsedItemIndex: number
  ): {
    previousItem: FlatTreeItemWithMarkers;
    currentResult: FlatTreeItemWithMarkers[];
    lastCollapsedItemIndex: number;
  } {
    const currentItemIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(currentItem, expandedItemsIds);

    const currentItemIsRoot: boolean = Object.is(currentItem.level, 0);
    if (currentItemIsRoot) {
      const itemToInsert: FlatTreeItemWithMarkers = { ...currentItem, __isCollapsed: currentItemIsCollapsed };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex: currentItemIsCollapsed ? currentItemIndex : lastCollapsedItemIndex
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
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex
      };
    }
    if (previousItemIsParent && !parentIsHidden && !parentIsCollapsed) {
      const itemToInsert: FlatTreeItemWithMarkers = { ...currentItem, __isCollapsed: currentItemIsCollapsed };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex: currentItemIsCollapsed ? currentItemIndex : lastCollapsedItemIndex
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
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex: currentItemIsCollapsed ? currentItemIndex : lastCollapsedItemIndex
      };
    }

    const noElementsWereCollapsed: boolean = isNullOrUndefined(lastCollapsedItemIndex);
    const lastCollapsedItem: FlatTreeItem = currentResult[lastCollapsedItemIndex];
    const lastCollapsedItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(lastCollapsedItem) &&
      FlatTreeDataSource.isCollapsed(lastCollapsedItem, expandedItemsIds) &&
      Object.is(lastCollapsedItem.level + 1, currentItem.level);
    if (noElementsWereCollapsed || !lastCollapsedItemIsParent) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isCollapsed: currentItemIsCollapsed
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex: currentItemIsCollapsed ? currentItemIndex : lastCollapsedItemIndex
      };
    }
    if (lastCollapsedItemIsParent) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert],
        lastCollapsedItemIndex
      };
    }
  }

  private static processNonExpandableItem(
    previousItem: FlatTreeItemWithMarkers,
    currentItem: FlatTreeItemWithMarkers,
    currentResult: FlatTreeItemWithMarkers[],
    expandedItemsIds: string[],
    lastCollapsedItemIndex: number
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

    const noElementsWereCollapsed: boolean = isNullOrUndefined(lastCollapsedItemIndex);
    const lastCollapsedItem: FlatTreeItem = currentResult[lastCollapsedItemIndex];
    const lastCollapsedItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(lastCollapsedItem) &&
      FlatTreeDataSource.isCollapsed(lastCollapsedItem, expandedItemsIds) &&
      Object.is(lastCollapsedItem.level + 1, currentItem.level);
    if (noElementsWereCollapsed || !lastCollapsedItemIsParent) {
      return {
        previousItem: currentItem,
        currentResult: [...currentResult, currentItem]
      };
    }
    if (lastCollapsedItemIsParent) {
      const itemToInsert: FlatTreeItemWithMarkers = {
        ...currentItem,
        __isHidden: true
      };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }
  }

  private static filterNotHiddenItems(
    source: FlatTreeItem[],
    expandedItemsIds: string[],
    previouslySavedLastCollapsedItemIndex: number
  ): FlatTreeItem[] {
    const visibleTreeItems: FlatTreeItem[] = source
      .filter((item: FlatTreeItem) => !isNullOrUndefined(item))
      .reduce(
        (
          [previousItem, result, lastCollapsedItemIndex]: [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[], number],
          item: FlatTreeItem,
          index: number
        ): [FlatTreeItemWithMarkers, FlatTreeItemWithMarkers[], number] => {
          if (FlatTreeDataSource.isExpandable(item)) {
            const expandableItemData: {
              previousItem: FlatTreeItemWithMarkers;
              currentResult: FlatTreeItemWithMarkers[];
              lastCollapsedItemIndex: number;
            } = FlatTreeDataSource.processExpandableItem(
              previousItem,
              item,
              index,
              result,
              expandedItemsIds,
              lastCollapsedItemIndex
            );
            return [
              expandableItemData.previousItem,
              expandableItemData.currentResult,
              expandableItemData.lastCollapsedItemIndex
            ];
          }

          const nonExpandableItemData: {
            previousItem: FlatTreeItemWithMarkers;
            currentResult: FlatTreeItemWithMarkers[];
          } = FlatTreeDataSource.processNonExpandableItem(
            previousItem,
            item,
            result,
            expandedItemsIds,
            lastCollapsedItemIndex
          );
          return [nonExpandableItemData.previousItem, nonExpandableItemData.currentResult, lastCollapsedItemIndex];
        },
        [null, [], previouslySavedLastCollapsedItemIndex]
      )
      .filter((turplePart: FlatTreeItemWithMarkers | FlatTreeItemWithMarkers[] | number) => Array.isArray(turplePart))
      .flat()
      .filter((item: FlatTreeItem) => !isNullOrUndefined(item) && !FlatTreeDataSource.isHidden(item));
    return visibleTreeItems;
  }
}
