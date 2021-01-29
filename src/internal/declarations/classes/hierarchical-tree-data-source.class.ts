import { ListRange } from '@angular/cdk/collections';
import { isEmpty, isNil } from '@bimeister/utilities/commonjs/common';
import { shareReplayWithRefCount } from '@bimeister/utilities/commonjs/rxjs';
import { asyncScheduler, BehaviorSubject, combineLatest, forkJoin, Observable, of, timer } from 'rxjs';
import { map, observeOn, subscribeOn, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeItem } from './tree-item.class';

interface NodeWithElements extends TreeItem {
  childElements: TreeItem[];
}

interface NodeWithChildren extends NodeWithElements {
  childNodes: NodeWithElements[];
}

interface TreeRoot {
  nodes: NodeWithChildren[];
  elements: TreeItem[];
}

/** @dynamic */
export class HierarchicalTreeDataSource extends FlatTreeDataSource {
  constructor(
    nodes$: Observable<TreeItem[]>,
    elements$: Observable<TreeItem[]>,
    expandedItemIds$: Observable<Set<string>>,
    activeRange$: Observable<ListRange>,
    hideRoot$: Observable<boolean>,
    processingIsActive$: BehaviorSubject<boolean>
  ) {
    super(
      HierarchicalTreeDataSource.getSortedData(nodes$, elements$, processingIsActive$),
      expandedItemIds$,
      activeRange$,
      hideRoot$,
      processingIsActive$
    );
  }

  private static getSortedData(
    nodes$: Observable<TreeItem[]>,
    elements$: Observable<TreeItem[]>,
    processingIsActive$: BehaviorSubject<boolean>
  ): Observable<FlatTreeItem[]> {
    const nodesCopy$: Observable<TreeItem[]> = nodes$.pipe(
      tap(() => processingIsActive$.next(true)),
      switchMap((nodes: TreeItem[]) => HierarchicalTreeDataSource.getClonedArrayItems(nodes)),
      shareReplayWithRefCount()
    );
    const elementsCopy$: Observable<TreeItem[]> = elements$.pipe(
      tap(() => processingIsActive$.next(true)),
      switchMap((nodes: TreeItem[]) => HierarchicalTreeDataSource.getClonedArrayItems(nodes)),
      shareReplayWithRefCount()
    );

    const elementsByParentId$: Observable<
      Map<string, TreeItem[]>
    > = HierarchicalTreeDataSource.getElementsByParentIdMap(elementsCopy$);

    const rootElements$: Observable<TreeItem[]> = HierarchicalTreeDataSource.getRootElements(elementsByParentId$);

    const nodesWithElementsByParentId$: Observable<
      Map<string, NodeWithElements[]>
    > = HierarchicalTreeDataSource.getNodesWithElementsByParentIdMap(nodesCopy$, elementsByParentId$);

    const treeRoot$: Observable<TreeRoot> = HierarchicalTreeDataSource.getTreeRoot(
      nodesWithElementsByParentId$,
      rootElements$
    );

    return HierarchicalTreeDataSource.getFlatTree(treeRoot$).pipe(tap(() => processingIsActive$.next(false)));
  }

  private static getFlatTree(treeRoot$: Observable<TreeRoot>): Observable<FlatTreeItem[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => treeRoot$),
      switchMap((treeRoot: TreeRoot) => {
        const { nodes, elements }: TreeRoot = treeRoot;
        const flatTreeElements$: Observable<FlatTreeItem[]> = HierarchicalTreeDataSource.childElementsToFlatTreeItems(
          elements
        );
        const groupedTreeNodesWithElements$: Observable<FlatTreeItem[][]> = isEmpty(nodes)
          ? of([])
          : forkJoin(
              nodes.map((node: NodeWithChildren) => HierarchicalTreeDataSource.nodeWithChildrenToFlatTreeItems(node))
            );
        const flatTreeNodesWithElements$: Observable<FlatTreeItem[]> = groupedTreeNodesWithElements$.pipe(
          switchMap((groupedTreeNodesWithElements: FlatTreeItem[][]) =>
            HierarchicalTreeDataSource.getFlatArray(groupedTreeNodesWithElements)
          )
        );
        return forkJoin([flatTreeNodesWithElements$, flatTreeElements$]);
      }),
      map(([flatTreeNodesWithElements, flatTreeElements]: [FlatTreeItem[], FlatTreeItem[]]) => {
        return [...flatTreeNodesWithElements, ...flatTreeElements].filter(
          (flatTreeItem: FlatTreeItem) => !isNil(flatTreeItem)
        );
      })
    );
  }

  private static getTreeRoot(
    nodesWithElementsByParentId$: Observable<Map<string, NodeWithElements[]>>,
    rootElements$: Observable<TreeItem<any>[]>
  ): Observable<TreeRoot> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => nodesWithElementsByParentId$),
      switchMap((nodesWithElementsByParentId: Map<string, NodeWithElements[]>) =>
        HierarchicalTreeDataSource.getNodesWithChildren(nodesWithElementsByParentId)
      ),
      switchMap((nodesWithChildren: NodeWithChildren[]) =>
        HierarchicalTreeDataSource.getFilteredRootNodes(nodesWithChildren)
      ),
      withLatestFrom(rootElements$),
      map(([rootNodes, rootElements]: [NodeWithChildren[], TreeItem[]]) => {
        return {
          nodes: rootNodes,
          elements: rootElements
        };
      })
    );
  }

  private static getFilteredRootNodes(nodesWithChildren: NodeWithChildren[]): Observable<NodeWithChildren[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => {
        return nodesWithChildren.filter((node: NodeWithChildren) => isNil(node.parentId));
      })
    );
  }

  private static getNodesWithChildren(
    nodesWithElementsByParentId: Map<string, NodeWithElements[]>
  ): Observable<NodeWithChildren[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => {
        const groupedNodesWithElements: NodeWithElements[][] = Array.from(nodesWithElementsByParentId.values());
        return HierarchicalTreeDataSource.getFlatArray(groupedNodesWithElements).pipe(
          switchMap((nodesWithElements: NodeWithElements[]) =>
            HierarchicalTreeDataSource.getFilledNodesWithElements(nodesWithElements, nodesWithElementsByParentId)
          )
        );
      }),
      switchMap((nodesWithElements: NodeWithElements[]) =>
        HierarchicalTreeDataSource.getFilledNodesWithChildren(nodesWithElements)
      )
    );
  }

  private static getFilledNodesWithChildren(nodesWithElements: NodeWithElements[]): Observable<NodeWithChildren[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => {
        return nodesWithElements.map(
          (node: NodeWithElements | NodeWithChildren): NodeWithChildren => {
            const childNodes: NodeWithElements[] = HierarchicalTreeDataSource.isNodeWithChildNodes(node)
              ? node.childNodes
              : [];
            const childElements: TreeItem[] = HierarchicalTreeDataSource.isNodeWithChildElements(node)
              ? node.childElements
              : [];

            return {
              ...node,
              childElements,
              childNodes
            };
          }
        );
      })
    );
  }

  /** @deprecated side effects */
  private static getFilledNodesWithElements(
    nodesWithElements: NodeWithElements[],
    nodesWithElementsByParentId: Map<string, NodeWithElements[]>
  ): Observable<NodeWithElements[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => {
        const nodeWithChildrenById: Map<string, NodeWithElements | NodeWithChildren> = new Map<
          string,
          NodeWithElements | NodeWithChildren
        >(nodesWithElements.map((node: NodeWithElements) => [node.id, node]));
        nodesWithElements.forEach((node: NodeWithElements) => {
          const childNodes: NodeWithElements[] = nodesWithElementsByParentId.has(node.id)
            ? nodesWithElementsByParentId.get(node.id).map((childNode: NodeWithElements) => {
                const childNodeId: string = childNode.id;
                return nodeWithChildrenById.get(childNodeId);
              })
            : [];

          Object.defineProperty(node, 'childNodes', {
            value: childNodes,
            configurable: true,
            enumerable: true,
            writable: true
          });
        });
        return nodesWithElements;
      })
    );
  }

  private static getNodesWithElementsByParentIdMap(
    nodesCopy$: Observable<TreeItem<any>[]>,
    elementsByParentId$: Observable<Map<string, TreeItem<any>[]>>
  ): Observable<Map<string, NodeWithElements[]>> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => combineLatest([nodesCopy$, elementsByParentId$])),
      map(([nodes, elementsByParentId]: [TreeItem[], Map<string, TreeItem[]>]) => {
        const resultMap: Map<string, NodeWithElements[]> = new Map<string, NodeWithElements[]>();
        const nodesWithElements: NodeWithElements[] = nodes.map((node: TreeItem) => {
          const nodeId: string = node.id;
          const childElements: TreeItem[] = elementsByParentId.has(nodeId) ? elementsByParentId.get(nodeId) : [];
          return {
            ...node,
            childElements
          };
        });
        nodesWithElements.forEach((nodeWithChildElements: NodeWithElements) => {
          const parentId: string = nodeWithChildElements.parentId;
          const existingNodes: NodeWithElements[] = resultMap.has(parentId) ? resultMap.get(parentId) : [];
          resultMap.set(parentId, [...existingNodes, nodeWithChildElements]);
        });
        return resultMap;
      })
    );
  }

  private static getRootElements(
    elementsByParentId$: Observable<Map<string, TreeItem<any>[]>>
  ): Observable<TreeItem<any>[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => elementsByParentId$),
      map((elementsByParentId: Map<string, TreeItem[]>) => {
        const rootParentIds: string[] = [null, undefined];
        return rootParentIds.map((parentId: string) => {
          return elementsByParentId.has(parentId) ? elementsByParentId.get(parentId) : [];
        });
      }),
      switchMap((groupedRootElements: TreeItem[][]) => HierarchicalTreeDataSource.getFlatArray(groupedRootElements))
    );
  }

  private static getElementsByParentIdMap(
    elementsCopy$: Observable<TreeItem<any>[]>
  ): Observable<Map<string, TreeItem<any>[]>> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => elementsCopy$),
      map((elements: TreeItem[]) => {
        const resultMap: Map<string, TreeItem[]> = new Map<string, TreeItem[]>();
        elements.forEach((element: TreeItem) => {
          const parentId: string = element.parentId;
          const existingElements: TreeItem[] = resultMap.has(parentId) ? resultMap.get(parentId) : [];
          resultMap.set(parentId, [...existingElements, element]);
        });
        return resultMap;
      })
    );
  }

  private static isNodeWithChildElements(item: TreeItem): item is NodeWithElements {
    return item.hasOwnProperty('childElements');
  }

  private static isNodeWithChildNodes(node: NodeWithElements): node is NodeWithChildren {
    return node.hasOwnProperty('childNodes');
  }

  private static nodeWithChildrenToFlatTreeItems(
    nodeWithChildren: NodeWithChildren,
    parentItemLevel: number | null = null
  ): Observable<FlatTreeItem[]> {
    const currentLevel: number = isNil(parentItemLevel) ? 0 : parentItemLevel + 1;
    const { isExpandable, name, id, originalData, isElement }: NodeWithChildren = nodeWithChildren;
    const node: FlatTreeItem = new FlatTreeItem(isExpandable, name, currentLevel, id, originalData, isElement);

    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => {
        const childElements$: Observable<FlatTreeItem[]> = HierarchicalTreeDataSource.childElementsToFlatTreeItems(
          nodeWithChildren.childElements,
          currentLevel
        );
        const groupedChildNodes$: Observable<
          FlatTreeItem[]
        >[] = nodeWithChildren.childNodes.map((childNode: NodeWithChildren) =>
          HierarchicalTreeDataSource.nodeWithChildrenToFlatTreeItems(childNode, currentLevel)
        );
        const childNodes$: Observable<FlatTreeItem[]> = isEmpty(groupedChildNodes$)
          ? of([])
          : forkJoin(groupedChildNodes$).pipe(
              switchMap((groupedChildNodes: FlatTreeItem[][]) =>
                HierarchicalTreeDataSource.getFlatArray(groupedChildNodes)
              )
            );

        return forkJoin([childNodes$, childElements$]).pipe(
          map(([childNodes, childElements]: [FlatTreeItem[], FlatTreeItem[]]) => {
            return [node, ...childNodes, ...childElements];
          })
        );
      })
    );
  }

  private static childElementsToFlatTreeItems(
    childElements: TreeItem[],
    parentItemLevel: number | null = null
  ): Observable<FlatTreeItem[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => {
        return childElements.map((childElement: TreeItem) => {
          const { isExpandable, name, id, originalData, isElement }: TreeItem = childElement;
          const currentLevel: number = isNil(parentItemLevel) ? 0 : parentItemLevel + 1;
          return new FlatTreeItem(isExpandable, name, currentLevel, id, originalData, isElement);
        });
      })
    );
  }

  private static getClonedArrayItems<T extends object>(input: T[]): Observable<T[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      switchMap(() => {
        if (isEmpty(input)) {
          return of([]);
        }
        return forkJoin(input.map((item: T) => HierarchicalTreeDataSource.getClonedObject(item)));
      })
    );
  }

  private static getClonedObject<T extends object>(item: T): Observable<T> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => ({ ...item }))
    );
  }

  private static getFlatArray<T extends object>(input: T[][]): Observable<T[]> {
    return timer(0, asyncScheduler).pipe(
      observeOn(asyncScheduler),
      subscribeOn(asyncScheduler),
      map(() => input.flat(1))
    );
  }
}
