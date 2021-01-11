import { DataSource, ListRange } from '@angular/cdk/collections';
import { isNil, shareReplayWithRefCount } from '@meistersoft/utilities';
import { asyncScheduler, BehaviorSubject, combineLatest, Observable, Subject, timer } from 'rxjs';
import { filter, map, observeOn, subscribeOn, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TreeDataSource } from '../interfaces/tree-data-source.interface';
import { FlatTreeItem } from './flat-tree-item.class';

type FlatTreeItemWithMarkers = FlatTreeItem & { __isCollapsed?: boolean; __isHidden?: boolean };

/** @dynamic */
export class FlatTreeDataSource extends DataSource<FlatTreeItem> implements TreeDataSource {
  public readonly disconnect$: Subject<void> = new Subject<void>();

  public readonly currentSlice$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);
  public readonly filteredData$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);

  private readonly treeDataWithProcessedRoot$: Observable<FlatTreeItem[]> = this.sortedData$.pipe(
    observeOn(asyncScheduler),
    subscribeOn(asyncScheduler),
    map((items: FlatTreeItem[]) => items.filter((item: FlatTreeItem) => !isNil(item))),
    withLatestFrom(this.hideRoot$),
    map(([currentSlice, hideRoot]: [FlatTreeItem[], boolean]) => {
      if (hideRoot) {
        return currentSlice.filter((sliceItem: FlatTreeItem) => sliceItem.level !== 0);
      }
      return currentSlice;
    }),
    shareReplayWithRefCount()
  );

  private readonly sanitizedActiveRange$: Observable<ListRange> = this.activeRange$.pipe(
    filter((range: ListRange) => !isNil(range) && range.start >= 0 && range.end >= 0),
    shareReplayWithRefCount()
  );

  private readonly treeDataWithoutHiddenItems$: Observable<FlatTreeItem[]> = combineLatest([
    this.treeDataWithProcessedRoot$,
    this.expandedItemIds$
  ]).pipe(
    observeOn(asyncScheduler),
    subscribeOn(asyncScheduler),
    tap(() => this.processingIsActive$.next(true)),
    switchMap(([allItems, expandedNodesIds]: [FlatTreeItem[], Set<string>]) => {
      return FlatTreeDataSource.getNotHiddenItems(allItems, expandedNodesIds);
    }),
    tap((filteredData: FlatTreeItem[]) => this.filteredData$.next(filteredData)),
    tap(() => this.processingIsActive$.next(false)),
    shareReplayWithRefCount()
  );

  constructor(
    public readonly sortedData$: Observable<FlatTreeItem[]>,
    public readonly expandedItemIds$: Observable<Set<string>>,
    public readonly activeRange$: Observable<ListRange>,
    public readonly hideRoot$: Observable<boolean>,
    public readonly processingIsActive$: BehaviorSubject<boolean>
  ) {
    super();
  }

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([this.sanitizedActiveRange$, this.treeDataWithoutHiddenItems$]).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(([range, treeDataWithoutHiddenItems]: [ListRange, FlatTreeItem[]]) => {
        const { start, end }: ListRange = range;
        return treeDataWithoutHiddenItems.slice(start, end);
      }),
      shareReplayWithRefCount(),
      tap((resultSlice: FlatTreeItem[]) => this.currentSlice$.next(resultSlice))
    );
  }

  public disconnect(): void {
    this.disconnect$.next();
  }

  private static isExpandable(item: FlatTreeItem): item is FlatTreeItem & { isExpandable: true } {
    return !isNil(item) && item.isExpandable;
  }

  private static isCollapsed(
    item: FlatTreeItem,
    expandedItemIds: Set<string>
  ): item is FlatTreeItem & { __isCollapsed: boolean } {
    if (isNil(item)) {
      return false;
    }
    const itemIsCollapsedManualy: boolean = item.hasOwnProperty('__isCollapsed') && Boolean(item['__isCollapsed']);
    const itemIsNotExpanded: boolean = !expandedItemIds.has(item.id);
    return FlatTreeDataSource.isExpandable(item) && (itemIsCollapsedManualy || itemIsNotExpanded);
  }

  private static isHidden(item: FlatTreeItem): item is FlatTreeItem & { __isHidden: boolean } {
    return !isNil(item) && item.hasOwnProperty('__isHidden') && Boolean(item['__isHidden']);
  }

  private static getNotHiddenItems(
    allItems: FlatTreeItem[],
    expandedNodesIds: Set<string>
  ): Observable<FlatTreeItem[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => {
        return FlatTreeDataSource.filterNotHiddenItems(allItems, expandedNodesIds);
      })
    );
  }

  private static processExpandableItem(
    previousItem: FlatTreeItemWithMarkers,
    currentItem: FlatTreeItemWithMarkers,
    currentItemIndex: number,
    currentResult: FlatTreeItemWithMarkers[],
    expandedItemIds: Set<string>
  ): {
    previousItem: FlatTreeItemWithMarkers;
    currentResult: FlatTreeItemWithMarkers[];
  } {
    const currentItemIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(currentItem, expandedItemIds);
    const currentItemLevel: number = Number(currentItem?.level);
    const previousItemLevel: number = Number(previousItem?.level);
    const currentItemIsRoot: boolean = Object.is(currentItemLevel, 0);
    if (currentItemIsRoot) {
      const itemToInsert: FlatTreeItemWithMarkers = { ...currentItem, __isCollapsed: currentItemIsCollapsed };
      return {
        previousItem: itemToInsert,
        currentResult: [...currentResult, itemToInsert]
      };
    }

    const previousItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(previousItem) && Object.is(previousItemLevel + 1, currentItemLevel);
    const parentIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    const parentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(previousItem, expandedItemIds);
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

    const previousItemIsSibling: boolean = Object.is(previousItemLevel, currentItemLevel);
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
        (item: FlatTreeItem) => FlatTreeDataSource.isExpandable(item) && Object.is(item.level + 1, currentItemLevel)
      );
    const farParentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(farParentItem, expandedItemIds);
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
      __isCollapsed: FlatTreeDataSource.isCollapsed(currentItem, expandedItemIds)
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
    expandedItemIds: Set<string>
  ): {
    previousItem: FlatTreeItemWithMarkers;
    currentResult: FlatTreeItemWithMarkers[];
  } {
    const currentItemLevel: number = Number(currentItem?.level);
    const currentItemIsRoot: boolean = Object.is(currentItemLevel, 0);
    if (currentItemIsRoot) {
      return {
        previousItem: currentItem,
        currentResult: [...currentResult, currentItem]
      };
    }

    const previousItemLevel: number = Number(previousItem?.level);
    const previousItemIsParent: boolean =
      FlatTreeDataSource.isExpandable(previousItem) && Object.is(previousItemLevel + 1, currentItemLevel);
    const parentIsHidden: boolean = FlatTreeDataSource.isHidden(previousItem);
    const parentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(previousItem, expandedItemIds);
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

    const previousItemIsSibling: boolean = Object.is(previousItemLevel, currentItemLevel);
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
        (item: FlatTreeItem) => FlatTreeDataSource.isExpandable(item) && Object.is(item.level + 1, currentItemLevel)
      );
    const farParentIsCollapsed: boolean = FlatTreeDataSource.isCollapsed(farParentItem, expandedItemIds);
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

  private static filterNotHiddenItems(source: FlatTreeItem[], expandedItemIds: Set<string>): FlatTreeItem[] {
    const visibleTreeItems: FlatTreeItem[] = source
      .filter((item: FlatTreeItem) => !isNil(item))
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
            } = FlatTreeDataSource.processExpandableItem(previousItem, item, index, result, expandedItemIds);
            return [expandableItemData.previousItem, expandableItemData.currentResult];
          }

          const nonExpandableItemData: {
            previousItem: FlatTreeItemWithMarkers;
            currentResult: FlatTreeItemWithMarkers[];
          } = FlatTreeDataSource.processNonExpandableItem(previousItem, item, index, result, expandedItemIds);
          return [nonExpandableItemData.previousItem, nonExpandableItemData.currentResult];
        },
        [null, []]
      )
      .filter((tuplePart: FlatTreeItemWithMarkers | FlatTreeItemWithMarkers[]) => Array.isArray(tuplePart))
      .flat(1)
      .filter((item: FlatTreeItem) => !isNil(item) && !FlatTreeDataSource.isHidden(item));
    return visibleTreeItems;
  }
}
