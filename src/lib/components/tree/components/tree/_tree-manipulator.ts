import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom, debounceTime } from 'rxjs/operators';
import { FlatTreeDataSource } from '../../../../../internal/declarations/classes/flat-tree-data-source.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

const TARGET_NODE_TO_SCROLL_TO_DEBOUNCE_TIME_MS: number = 500;

export class NewTreeManipulator {
  private readonly subscription: Subscription = new Subscription();

  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject(null);

  public readonly itemToExpand$: BehaviorSubject<FlatTreeItem> = new BehaviorSubject(null);
  public readonly expandedItemsIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    NewTreeManipulator.getLevel,
    NewTreeManipulator.isExpandable
  );

  public readonly dataSource: FlatTreeDataSource = new FlatTreeDataSource(
    this.dataOrigin$,
    this.expandedItemsIds$,
    this.listRange$
  );

  private readonly scrollByRoute$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly indexToScrollBy$: Observable<number> = this.scrollByRoute$.pipe(
    filter(
      (routeToScrollBy: string[]) => Array.isArray(routeToScrollBy) && !NewTreeManipulator.isEmptyArray(routeToScrollBy)
    ),
    debounceTime(TARGET_NODE_TO_SCROLL_TO_DEBOUNCE_TIME_MS),
    map((routeToScrollBy: string[]) => routeToScrollBy[routeToScrollBy.length - 1]),
    switchMap((targetNodeId: string) =>
      this.dataOrigin$.pipe(
        map((nodes: FlatTreeItem[]) => nodes.map((node: FlatTreeItem) => node?.id)),
        map((nodesIds: string[]) => nodesIds.indexOf(targetNodeId))
      )
    )
  );

  constructor(
    private readonly dataOrigin$: Observable<FlatTreeItem[]>,
    public readonly selectedNodesIds$: Observable<string[]>,
    private readonly viewPortReference$: Observable<CdkVirtualScrollViewport>,
    private readonly skeletonViewPortReference$: Observable<CdkVirtualScrollViewport>
  ) {}

  public initialize(): void {
    this.refreshViewPort();
    this.setInitialVisibleRange();
    this.subscription
      .add(this.addParentNodesToExpandedOnScrollByRouteEmits())
      .add(this.refreshViewPortOnExpindedItemsIdsChange());
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }

  public scrollByRoute(route: string[]): void {
    this.scrollByRoute$.next(route);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    const nodeId: string = node?.id;
    if (isNullOrUndefined(nodeId)) {
      return;
    }
    this.expandedItemsIds$
      .pipe(
        take(1),
        map((expandedItemsIds: string[]) => [expandedItemsIds.includes(nodeId), expandedItemsIds])
      )
      .subscribe(([nodeIsExpanded, expandedItemsIds]: [boolean, string[]]) => {
        if (nodeIsExpanded) {
          this.markAsCollapsed(expandedItemsIds, nodeId);
          return;
        }
        this.itemToExpand$.next(node);
        this.markAsExpanded(expandedItemsIds, nodeId);
      });
  }

  private markAsCollapsed(expandedItemsIds: string[], ...nodesToCollapseIds: string[]): void {
    if (!Array.isArray(nodesToCollapseIds) || NewTreeManipulator.isEmptyArray(nodesToCollapseIds)) {
      return;
    }

    const expandedItemsIdsSet: Set<string> = new Set(expandedItemsIds);
    nodesToCollapseIds.forEach((nodeId: string) => {
      expandedItemsIdsSet.delete(nodeId);
    });
    const updatedExpandedItemsIds: string[] = Array.from(expandedItemsIdsSet);
    this.expandedItemsIds$.next(updatedExpandedItemsIds);
  }

  private markAsExpanded(expandedItemsIds: string[], ...nodesToExpandIds: string[]): void {
    if (!Array.isArray(nodesToExpandIds) || NewTreeManipulator.isEmptyArray(nodesToExpandIds)) {
      return;
    }

    const expandedItemsIdsSet: Set<string> = new Set(expandedItemsIds);
    nodesToExpandIds.forEach((nodeId: string) => {
      expandedItemsIdsSet.add(nodeId);
    });
    const updatedExpandedItemsIds: string[] = Array.from(expandedItemsIdsSet);
    this.expandedItemsIds$.next(updatedExpandedItemsIds);
  }

  private updateVisibleRange(range: ListRange): void {
    this.listRange$.next(range);
  }

  private refreshViewPort(): void {
    combineLatest([
      this.viewPortReference$.pipe(filter((viewPort: CdkVirtualScrollViewport) => !isNullOrUndefined(viewPort))),
      this.skeletonViewPortReference$.pipe(filter((viewPort: CdkVirtualScrollViewport) => !isNullOrUndefined(viewPort)))
    ])
      .pipe(take(1))
      .subscribe(([viewPort, skeletonViewPort]: [CdkVirtualScrollViewport, CdkVirtualScrollViewport]) => {
        viewPort.checkViewportSize();
        skeletonViewPort.checkViewportSize();
      });
  }

  /** @deprecated refactor: make initial range relative to component height */
  private setInitialVisibleRange(): void {
    this.dataOrigin$
      .pipe(
        filter((nodes: FlatTreeItem[]) => Array.isArray(nodes) && !NewTreeManipulator.isEmptyArray(nodes)),
        take(1),
        map((nodes: FlatTreeItem[]) => ({
          start: 0,
          end: nodes.length < 100 ? nodes.length : 100
        }))
      )
      .subscribe((range: ListRange) => {
        this.updateVisibleRange(range);
        this.subscription.add(this.updateRangeOnDataExtraction());
      });
  }

  private refreshViewPortOnExpindedItemsIdsChange(): Subscription {
    return this.expandedItemsIds$.subscribe(() => this.refreshViewPort());
  }

  private addParentNodesToExpandedOnScrollByRouteEmits(): Subscription {
    return this.scrollByRoute$
      .pipe(
        filter(
          (routeToScrollBy: string[]) =>
            Array.isArray(routeToScrollBy) && !NewTreeManipulator.isEmptyArray(routeToScrollBy)
        ),
        map((routeToScrollBy: string[]) => routeToScrollBy.slice(0, routeToScrollBy.length - 1)),
        withLatestFrom(this.expandedItemsIds$)
      )
      .subscribe(([parentNodesIds, expandedItemsIds]: [string[], string[]]) => {
        this.markAsExpanded(expandedItemsIds, ...parentNodesIds);
      });
  }

  private updateRangeOnDataExtraction(): Subscription {
    return this.viewPortReference$
      .pipe(
        filter((viewPort: CdkVirtualScrollViewport) => !isNullOrUndefined(viewPort)),
        switchMap((viewPort: CdkVirtualScrollViewport) => viewPort.renderedRangeStream)
      )
      .subscribe((range: ListRange) => {
        this.updateVisibleRange(range);
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
