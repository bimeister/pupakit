import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ElementRef } from '@angular/core';
import { filterNotNil, isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { TreeType } from '../enums/tree-type.enum';
import { TreeDataSource } from '../interfaces/tree-data-source.interface';
import { TreeManipulatorDataOrigin } from '../types/tree-manipulator-data-origin.type';
import { CustomTreeDataSource } from './custom-data-source.class';
import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { HierarchicalTreeDataSource } from './hierarchical-tree-data-source.class';

const TARGET_NODE_TO_SCROLL_TO_DEBOUNCE_TIME_MS: number = 500;

export class TreeManipulator {
  private readonly subscription: Subscription = new Subscription();

  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject(null);

  public readonly itemToExpand$: BehaviorSubject<FlatTreeItem> = new BehaviorSubject(null);
  public readonly expandedItemIds$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeManipulator.getLevel,
    TreeManipulator.isExpandable
  );

  public readonly dataSource: TreeDataSource;

  public readonly rawData$: Observable<FlatTreeItem[]>;

  private readonly scrollByRoute$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly indexToScrollBy$: Observable<number> = this.scrollByRoute$.pipe(
    filter(
      (routeToScrollBy: string[]) => Array.isArray(routeToScrollBy) && !TreeManipulator.isEmptyArray(routeToScrollBy)
    ),
    debounceTime(TARGET_NODE_TO_SCROLL_TO_DEBOUNCE_TIME_MS),
    map((routeToScrollBy: string[]) => routeToScrollBy[routeToScrollBy.length - 1]),
    switchMap((targetNodeId: string) =>
      this.dataSource.filteredData$.pipe(
        take(1),
        map((nodes: FlatTreeItem[]) => nodes.map((node: FlatTreeItem) => node?.id)),
        map((nodesIds: string[]) => nodesIds.indexOf(targetNodeId)),
        filter((targetIndex: number) => !Object.is(targetIndex, -1))
      )
    )
  );

  constructor(
    private readonly dataOrigin: TreeManipulatorDataOrigin,
    private readonly viewPortReference$: Observable<CdkVirtualScrollViewport>,
    private readonly skeletonViewPortReference$: Observable<CdkVirtualScrollViewport>,
    private readonly viewPortItemHeightPx: number
  ) {
    switch (this.dataOrigin.type) {
      case TreeType.Flat: {
        this.dataSource = new FlatTreeDataSource(
          this.dataOrigin.flatDataOrigin,
          this.expandedItemIds$,
          this.listRange$,
          this.dataOrigin.hideRoot
        );
        break;
      }

      case TreeType.Hierarchical: {
        this.dataSource = new HierarchicalTreeDataSource(
          this.dataOrigin.treeNodesOrigin,
          this.dataOrigin.treeElementsOrigin,
          this.expandedItemIds$,
          this.listRange$,
          this.dataOrigin.hideRoot
        );
        break;
      }

      case TreeType.Custom: {
        this.dataSource = new CustomTreeDataSource(this.expandedItemIds$, this.listRange$, this.dataOrigin.hideRoot);
        break;
      }

      default: {
        return;
      }
    }

    this.rawData$ = this.dataSource.sortedData$;
  }

  public initialize(): void {
    this.refreshViewPort();
    this.setInitialVisibleRange();
    this.subscription
      .add(this.addParentNodesToExpandedOnScrollByRouteEmits())
      .add(this.refreshViewPortOnExpindedItemsIdsChange())
      .add(this.restoreExpansionForRecreatedElements());
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }

  public scrollByRoute(route: string[]): void {
    this.scrollByRoute$.next(route);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    const nodeId: string = node?.id;
    if (isNil(nodeId)) {
      return;
    }
    this.expandedItemIds$
      .pipe(
        take(1),
        map((expandedItemIds: Set<string>) => [expandedItemIds.has(nodeId), expandedItemIds])
      )
      .subscribe(([nodeIsExpanded, expandedItemIds]: [boolean, Set<string>]) => {
        if (nodeIsExpanded) {
          this.markAsCollapsed(expandedItemIds, nodeId);
          return;
        }
        this.itemToExpand$.next(node);
        this.markAsExpanded(expandedItemIds, nodeId);
      });
  }

  public expand(...nodes: FlatTreeItem[]): void {
    const uniqueNodesToExpandIdsSet: Set<string> = new Set<string>();
    for (const expandedNode of nodes) {
      this.itemToExpand$.next(expandedNode);
      uniqueNodesToExpandIdsSet.add(expandedNode.id);
    }
    this.expandedItemIds$.pipe(take(1)).subscribe((expandedItemIds: Set<string>) => {
      this.markAsExpanded(expandedItemIds, ...Array.from(uniqueNodesToExpandIdsSet.keys()));
    });
  }

  private markAsCollapsed(expandedItemIds: Set<string>, ...nodesToCollapseIds: string[]): void {
    if (!Array.isArray(nodesToCollapseIds) || TreeManipulator.isEmptyArray(nodesToCollapseIds)) {
      return;
    }

    const updatedExpandedItemsIds: Set<string> = new Set(expandedItemIds);
    nodesToCollapseIds.forEach((nodeId: string) => {
      updatedExpandedItemsIds.delete(nodeId);
    });
    this.expandedItemIds$.next(updatedExpandedItemsIds);
  }

  private markAsExpanded(expandedItemIds: Set<string>, ...nodesToExpandIds: string[]): void {
    if (!Array.isArray(nodesToExpandIds) || TreeManipulator.isEmptyArray(nodesToExpandIds)) {
      return;
    }

    const updatedExpandedItemsIds: Set<string> = new Set(expandedItemIds);
    nodesToExpandIds.forEach((nodeId: string) => {
      updatedExpandedItemsIds.add(nodeId);
    });
    this.expandedItemIds$.next(updatedExpandedItemsIds);
  }

  private updateVisibleRange(range: ListRange): void {
    this.listRange$.next(range);
  }

  private refreshViewPort(): void {
    combineLatest([
      this.viewPortReference$.pipe(filter((viewPort: CdkVirtualScrollViewport) => !isNil(viewPort))),
      this.skeletonViewPortReference$.pipe(filter((viewPort: CdkVirtualScrollViewport) => !isNil(viewPort)))
    ])
      .pipe(take(1))
      .subscribe(([viewPort, skeletonViewPort]: [CdkVirtualScrollViewport, CdkVirtualScrollViewport]) => {
        viewPort.checkViewportSize();
        skeletonViewPort.checkViewportSize();
      });
  }

  private setInitialVisibleRange(): void {
    this.rawData$
      .pipe(
        filter((nodes: FlatTreeItem[]) => Array.isArray(nodes) && !TreeManipulator.isEmptyArray(nodes)),
        take(1),
        withLatestFrom(
          this.viewPortReference$.pipe(
            map((viewPort: CdkVirtualScrollViewport) => viewPort.elementRef),
            map((viewPortNativeElement: ElementRef<HTMLElement>) =>
              viewPortNativeElement.nativeElement.getBoundingClientRect()
            ),
            map((viewPortRect: ClientRect) => viewPortRect.height),
            map((viewPortHeightPx: number) => Math.ceil(viewPortHeightPx / this.viewPortItemHeightPx)),
            map((viewPortItemsCountToFit: number) => {
              const additionItemsToPreRender: number = 10;
              return viewPortItemsCountToFit + additionItemsToPreRender;
            })
          )
        ),
        map(([nodes, maxItemsLimit]: [FlatTreeItem[], number]) => ({
          start: 0,
          end: nodes.length < maxItemsLimit ? nodes.length : maxItemsLimit
        }))
      )
      .subscribe((range: ListRange) => {
        this.updateVisibleRange(range);
        this.subscription.add(this.updateRangeOnDataExtraction());
      });
  }

  private refreshViewPortOnExpindedItemsIdsChange(): Subscription {
    return this.expandedItemIds$.subscribe(() => this.refreshViewPort());
  }

  private addParentNodesToExpandedOnScrollByRouteEmits(): Subscription {
    return this.scrollByRoute$
      .pipe(
        filter(
          (routeToScrollBy: string[]) =>
            Array.isArray(routeToScrollBy) && !TreeManipulator.isEmptyArray(routeToScrollBy)
        ),
        map((routeToScrollBy: string[]) => routeToScrollBy.slice(0, routeToScrollBy.length - 1)),
        withLatestFrom(this.expandedItemIds$)
      )
      .subscribe(([parentNodesIds, expandedItemIds]: [string[], Set<string>]) => {
        this.markAsExpanded(expandedItemIds, ...parentNodesIds);
      });
  }

  private updateRangeOnDataExtraction(): Subscription {
    return this.viewPortReference$
      .pipe(
        filterNotNil(),
        switchMap((viewPort: CdkVirtualScrollViewport) => viewPort.renderedRangeStream)
      )
      .subscribe((range: ListRange) => {
        this.updateVisibleRange(range);
      });
  }

  private restoreExpansionForRecreatedElements(): Subscription {
    return this.dataSource.currentSlice$
      .pipe(withLatestFrom(this.expandedItemIds$))
      .subscribe(([treeItems, expandedIds]) => {
        treeItems
          .filter(item => expandedIds.has(item.id))
          .forEach(item => {
            this.treeControl.expand(item);
          });
      });
  }

  private static getLevel(node: FlatTreeItem): number {
    return node.level;
  }

  private static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }

  private static isEmptyArray<T>(array: T[]): array is [] {
    return Array.isArray(array) && Object.is(array.length, 0);
  }
}
