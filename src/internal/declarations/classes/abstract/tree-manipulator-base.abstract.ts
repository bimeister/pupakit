import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { filterNotEmpty, isEmpty, isNil, mapToVoid, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, concat, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, mapTo, skip, switchMap, take, tap } from 'rxjs/operators';
import { VOID } from '../../../constants/void.const';
import { TreeManipulatorNewDataOrigin } from '../../interfaces/tree-manipulator-new-data-origin.interface';
import { CustomTreeDataSource } from '../custom-data-source.class';
import { FlatTreeItem } from '../flat-tree-item.class';
import { TreeDragAndDropControl } from '../tree-drag-and-drop.class';

interface FlatTreeItemWithIndex extends FlatTreeItem {
  index: number;
}

const DEFAULT_TRACK_BY_FUNCTION: TrackByFunction<FlatTreeItem> = (index: number, item: FlatTreeItem): string => {
  if (isNil(item)) {
    return `${index}__null_null_null_null`;
  }
  const { id, isExpandable, level, name }: FlatTreeItem = item;
  return `${index}__${id}_${isExpandable}_${level}_${name}`;
};

export abstract class TreeManipulatorBase {
  protected readonly data$: Observable<FlatTreeItem[]>;
  protected readonly fetchChildrenFunction: (parentId: string) => Observable<FlatTreeItem[]>;
  protected readonly hideRoot: Observable<boolean>;

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeManipulatorBase.getLevel,
    TreeManipulatorBase.isExpandable
  );
  public readonly expandedItemIds$: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());
  public readonly scrollIndex$: Observable<number>;

  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isScrollByRouteLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly viewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject<CdkVirtualScrollViewport>(
    1
  );
  public readonly skeletonViewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject<CdkVirtualScrollViewport>(
    1
  );
  public readonly listRange$: BehaviorSubject<Nullable<ListRange>> = new BehaviorSubject<Nullable<ListRange>>(null);

  public readonly dataSource: CustomTreeDataSource;
  public readonly dragAndDropControl: TreeDragAndDropControl;

  public readonly externalNodeTemplate$: Observable<TemplateRef<any>>;
  public readonly externalTrackBy$: Observable<TrackByFunction<FlatTreeItem>>;
  public readonly externalNodesWithoutPadding$: Observable<boolean>;
  public readonly externalScrollBehavior$: Observable<ScrollBehavior>;
  public readonly externalHasDragAndDrop$: Observable<boolean>;
  public readonly externalSelectedNodesIds$: Observable<string[]>;
  public readonly externalHighlightedNodesIds$: Observable<string[]>;
  public readonly externalScrollByRoute$: Observable<string[]>;
  public readonly externalIsLoading$: Observable<boolean>;

  public readonly fetchOnCreate: boolean;

  constructor(dataOrigin: TreeManipulatorNewDataOrigin) {
    this.fetchChildrenFunction = dataOrigin.fetchChildrenFunction;
    this.hideRoot = dataOrigin.hideRoot;
    this.externalScrollByRoute$ = dataOrigin.scrollByRoute;
    this.externalNodeTemplate$ = dataOrigin.nodeTemplate ?? of(null);
    this.externalScrollBehavior$ = dataOrigin.scrollBehavior ?? of('smooth');
    this.externalTrackBy$ = dataOrigin.trackBy ?? of(DEFAULT_TRACK_BY_FUNCTION);
    this.externalNodesWithoutPadding$ = dataOrigin.nodesWithoutPadding ?? of(false);
    this.externalHasDragAndDrop$ = dataOrigin.hasDragAndDrop ?? of(false);
    this.externalSelectedNodesIds$ = dataOrigin.selectedNodesIds ?? of([]);
    this.externalHighlightedNodesIds$ = dataOrigin.highlightedNodesIds ?? of([]);
    this.externalScrollByRoute$ = dataOrigin.scrollByRoute ?? of([]);
    this.externalIsLoading$ = dataOrigin.isLoading ?? of(false);
    this.fetchOnCreate = dataOrigin.fetchOnCreate ?? true;
    this.dataSource = new CustomTreeDataSource(this.expandedItemIds$, this.listRange$, this.hideRoot);
    this.data$ = this.dataSource.filteredData$;
    this.scrollIndex$ = this.getScrollIndex();
    this.dragAndDropControl = new TreeDragAndDropControl();
  }

  public refreshData(): void {
    this.fetchAndSaveChildren().subscribe();
  }

  public refreshViewPort(): void {
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

  /**
   * @description CARE: displayed arrows will not fit to displayed children
   */
  public resetExpandedSet(): void {
    this.expandedItemIds$.next(new Set());
  }

  public expand(nodeIdsList: string[]): void {
    this.expandListAsync(nodeIdsList).subscribe();
  }

  public expandBranch(nodeId: string): void {
    this.expandBranchAsync(nodeId).subscribe();
  }

  public collapse(nodesList: FlatTreeItem[]): void {
    this.expandedItemIds$.pipe(take(1)).subscribe((expandedItemIds: Set<string>) => {
      const expandedNodesList: FlatTreeItem[] = nodesList.filter((node: FlatTreeItem) => expandedItemIds.has(node.id));
      expandedNodesList.forEach((node: FlatTreeItem) => this.removeAndCollapse(node));
    });
  }

  public getNodeById(nodeId: string): Observable<FlatTreeItem> {
    return this.data$.pipe(
      take(1),
      map((data: FlatTreeItem[]) => data.find((dataItem: FlatTreeItem) => dataItem.id === nodeId))
    );
  }

  public getIndexByNode(node: FlatTreeItem): Observable<number> {
    return this.data$.pipe(
      take(1),
      map((data: FlatTreeItem[]) => data.indexOf(node))
    );
  }

  public updateItems(nodeList: FlatTreeItem[]): void {
    const nodeMap: Map<string, FlatTreeItem> = new Map(nodeList.map((node: FlatTreeItem) => [node.id, node]));
    this.data$
      .pipe(
        take(1),
        map((data: FlatTreeItem[]) => {
          return data.map((dataItem: FlatTreeItem) => {
            if (nodeMap.has(dataItem.id)) {
              return { ...dataItem, ...nodeMap.get(dataItem.id) };
            }
            return dataItem;
          });
        })
      )
      .subscribe((data: FlatTreeItem[]) => this.dataSource.setFilteredData(data));
  }

  private expandListAsync(nodeIdsList: string[]): Observable<void> {
    const nonExistNodeIdsList: string[] = [];
    const existNodesList: FlatTreeItem[] = [];
    return combineLatest(
      nodeIdsList.map((nodeId: string) => this.getNodeById(nodeId).pipe(map((node: FlatTreeItem) => [node, nodeId])))
    ).pipe(
      map((nodeWithIdList: [FlatTreeItem, string][]) => {
        nodeWithIdList.forEach(([node, nodeId]: [FlatTreeItem, string]) =>
          isNil(node) ? nonExistNodeIdsList.push(nodeId) : existNodesList.push(node)
        );
        return existNodesList;
      }),
      switchMap((nodeList: FlatTreeItem[]) => {
        return isEmpty(nodeList)
          ? of(VOID)
          : combineLatest(nodeList.map((existNode: FlatTreeItem) => this.expandAsync(existNode))).pipe(
              switchMap(() => this.expandListAsync(nonExistNodeIdsList))
            );
      }),
      mapToVoid()
    );
  }

  private expandBranchAsync(nodeId: string): Observable<void> {
    return this.getNodeById(nodeId).pipe(
      switchMap((node: FlatTreeItem) => this.getIndexByNode(node).pipe(map((index: number) => ({ ...node, index })))),
      filter((node: FlatTreeItemWithIndex) => node.index !== -1 && node.isExpandable),
      switchMap((node: FlatTreeItemWithIndex) =>
        this.isExpanded(node.id).pipe(map((isExpanded: boolean) => [node, isExpanded]))
      ),
      switchMap(([node, isExpanded]: [FlatTreeItemWithIndex, boolean]) => {
        const getChildren: Observable<FlatTreeItem[]> = isExpanded
          ? this.fetchChildrenFunction(node.id)
          : this.fetchAndSaveChildren(node);
        return getChildren.pipe(map((childrenList: FlatTreeItem[]) => [node, childrenList]));
      }),
      switchMap(([node, childrenList]: [FlatTreeItemWithIndex, FlatTreeItem[]]) =>
        this.expandExistNodeAsync(node).pipe(mapTo(childrenList))
      ),
      map((childrenList: FlatTreeItem[]) =>
        childrenList.map((childNode: FlatTreeItem) => this.expandBranchAsync(childNode.id))
      ),
      switchMap((childrenExpandList: Observable<void>[]) => concat(...childrenExpandList)),
      mapToVoid()
    );
  }

  private getScrollIndex(): Observable<number> {
    return this.data$.pipe(
      skip(1),
      take(1),
      switchMap(() => this.externalScrollByRoute$),
      filterNotEmpty(),
      tap(() => this.isScrollByRouteLoading$.next(true)),
      switchMap((parentNodesIds: string[]) => {
        const route: string[] = parentNodesIds.slice(0, parentNodesIds.length - 1);
        const itemIdToScroll: string = parentNodesIds.pop();
        return this.fetchAndExpandRoute(route).pipe(mapTo(itemIdToScroll));
      }),
      switchMap((nodeId: string) => this.getNodeById(nodeId)),
      switchMap((node: FlatTreeItem) => this.getIndexByNode(node)),
      tap(() => this.isScrollByRouteLoading$.next(false))
    );
  }

  private fetchAndExpandRoute(route: string[]): Observable<string[]> {
    if (isEmpty(route)) {
      return of([]);
    }
    return this.getNodeById(route[0]).pipe(
      switchMap((parentNode: Nullable<FlatTreeItem>) =>
        isNil(parentNode)
          ? of(false)
          : this.isExpanded(parentNode.id).pipe(
              switchMap((isExpanded: boolean) =>
                isExpanded ? of(true) : this.expandNonExistNodeAsync(parentNode).pipe(mapTo(true))
              )
            )
      ),
      switchMap((nodeExists: boolean) => {
        const following: string[] = route.slice(1);
        return !nodeExists || isEmpty(route) ? of([]) : this.fetchAndExpandRoute(following);
      })
    );
  }

  private removeAndCollapse(node: FlatTreeItem): void {
    this.expandedItemIds$.pipe(take(1)).subscribe((expandedItemIds: Set<string>) => {
      this.markAsCollapsed(expandedItemIds, node.id);
      this.removeCollapsed(node);
    });
  }

  private collapseNonExistNode(nodeId: string): void {
    this.expandedItemIds$.pipe(take(1)).subscribe((expandedItemIds: Set<string>) => {
      this.markAsCollapsed(expandedItemIds, nodeId);
    });
  }

  private expandAsync(node: FlatTreeItem): Observable<void> {
    return this.isExpanded(node.id).pipe(
      switchMap((isExpanded: boolean) =>
        isExpanded ? this.expandExistNodeAsync(node) : this.expandNonExistNodeAsync(node)
      )
    );
  }

  private markAsCollapsed(expandedItemIds: Set<string>, ...nodesToCollapseIds: string[]): void {
    if (!Array.isArray(nodesToCollapseIds) || isEmpty(nodesToCollapseIds)) {
      return;
    }

    const updatedExpandedItemsIds: Set<string> = new Set(expandedItemIds);
    nodesToCollapseIds.forEach((nodeId: string) => {
      updatedExpandedItemsIds.delete(nodeId);
    });
    this.expandedItemIds$.next(updatedExpandedItemsIds);
  }

  private removeCollapsed(parentNode: FlatTreeItem): void {
    this.data$.pipe(take(1)).subscribe((data: FlatTreeItem[]) => {
      const parentIndex: number = data.indexOf(parentNode);
      if (parentIndex === -1) {
        return;
      }
      const dataBehindParent: FlatTreeItem[] = data.slice(parentIndex + 1);
      const dataInFrontOfParent: FlatTreeItem[] = data.slice(0, parentIndex + 1);
      const nextParentWithSameLevelIndex: number = dataBehindParent.findIndex(
        (item: FlatTreeItem) => item.level <= parentNode.level
      );
      const parentNodeIsLastParent: boolean = nextParentWithSameLevelIndex === -1;
      if (parentNodeIsLastParent) {
        this.dataSource.setFilteredData(dataInFrontOfParent);
        return;
      }
      const dataBehindChildren: FlatTreeItem[] = dataBehindParent.slice(nextParentWithSameLevelIndex);
      const dataWithoutChildren: FlatTreeItem[] = [...dataInFrontOfParent, ...dataBehindChildren];
      this.dataSource.setFilteredData(dataWithoutChildren);
    });
  }

  private expandNonExistNodeAsync(node: FlatTreeItem): Observable<void> {
    return this.getIndexByNode(node).pipe(
      switchMap((index: number) => this.fetchAndSaveChildren({ ...node, index })),
      take(1),
      switchMap(() => this.expandExistNodeAsync(node)),
      take(1)
    );
  }

  private expandExistNodeAsync(node: FlatTreeItem): Observable<void> {
    return this.expandedItemIds$.pipe(
      take(1),
      tap((expandedItemIds: Set<string>) => {
        expandedItemIds.add(node.id);
        this.treeControl.expand(node);
      }),
      mapToVoid()
    );
  }

  private isExpanded(nodeId: string): Observable<boolean> {
    return this.expandedItemIds$.pipe(
      take(1),
      map((expandedItemIds: Set<string>) => expandedItemIds.has(nodeId))
    );
  }

  private fetchAndSaveChildren(parentNodeWithIndex: FlatTreeItemWithIndex = null): Observable<FlatTreeItem[]> {
    if (isNil(this.fetchChildrenFunction)) {
      return of([]);
    }
    this.isLoading$.next(true);
    const isRoot: boolean = isNil(parentNodeWithIndex);
    const parentId: string = isRoot ? null : parentNodeWithIndex.id;
    return this.fetchChildrenFunction(parentId).pipe(
      take(1),
      switchMap((children: FlatTreeItem[]) => this.data$.pipe(map((data: FlatTreeItem[]) => [data, children]))),
      take(1),
      map(([data, children]: [FlatTreeItem[], FlatTreeItem[]]) => {
        if (isRoot) {
          this.resetExpandedSet();
          const rootData: FlatTreeItem[] = children.map((childItem: FlatTreeItem) => {
            const childItemWithLevel: FlatTreeItem = {
              ...childItem,
              level: 0
            };
            return childItemWithLevel;
          });
          return [rootData, children];
        }
        const childrenLevel: number = parentNodeWithIndex.level + 1;
        const childrenPosition: number = parentNodeWithIndex.index + 1;
        const childrenWithLevel: FlatTreeItem[] = children.map((childItem: FlatTreeItem) => {
          this.collapseNonExistNode(childItem.id);
          const childItemWithLevel: FlatTreeItem = {
            ...childItem,
            level: childrenLevel
          };
          return childItemWithLevel;
        });
        const newData: FlatTreeItem[] = [
          ...data.slice(0, childrenPosition),
          ...childrenWithLevel,
          ...data.slice(childrenPosition)
        ];
        return [newData, children];
      }),
      tap(([data, _]: [FlatTreeItem[], FlatTreeItem[]]) => this.dataSource.setFilteredData(data)),
      map(([_, children]: [FlatTreeItem[], FlatTreeItem[]]) => children),
      tap(() => this.isLoading$.next(false))
    );
  }

  private static getLevel(node: FlatTreeItem): number {
    return node.level;
  }

  private static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }
}
