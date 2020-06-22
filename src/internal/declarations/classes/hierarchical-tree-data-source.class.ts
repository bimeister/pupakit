import { ListRange } from '@angular/cdk/collections';
import { combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from '../../helpers/api';
import { FlatTreeItem } from './api';
import { FlatTreeDataSource } from './flat-tree-data-source.class';
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

export class HierarchicalTree extends FlatTreeDataSource {
  constructor(
    nodes$: Observable<TreeItem[]>,
    elements$: Observable<TreeItem[]>,
    expandedItemsIds$: Observable<string[]>,
    activeRange$: Observable<ListRange>
  ) {
    super(HierarchicalTree.getSortedData(nodes$, elements$), expandedItemsIds$, activeRange$);
  }

  private static getSortedData(
    nodes$: Observable<TreeItem[]>,
    elements$: Observable<TreeItem[]>
  ): Observable<FlatTreeItem[]> {
    const nodesCopy$: Observable<TreeItem[]> = nodes$.pipe(
      map((treeItems: TreeItem[]) => treeItems.map((treeItem: TreeItem) => ({ ...treeItem })))
    );
    const elementsCopy$: Observable<TreeItem[]> = elements$.pipe(
      map((treeItems: TreeItem[]) => treeItems.map((treeItem: TreeItem) => ({ ...treeItem })))
    );

    const elementsByParentId$: Observable<Map<string, TreeItem[]>> = elementsCopy$.pipe(
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

    const rootElements$: Observable<TreeItem[]> = elementsByParentId$.pipe(
      map((elementsByParentId: Map<string, TreeItem[]>) => {
        const rootParentIds: string[] = [null, undefined];
        const rootElements: TreeItem[] = rootParentIds
          .map((parentId: string) => elementsByParentId.get(parentId))
          .flat(1);
        return rootElements;
      })
    );

    const nodesWithElementsByParentId$: Observable<Map<string, NodeWithElements[]>> = combineLatest([
      nodesCopy$,
      elementsByParentId$
    ]).pipe(
      map(([nodes, elementsByParentId]: [TreeItem[], Map<string, TreeItem[]>]) => {
        const resultMap: Map<string, NodeWithElements[]> = new Map<string, NodeWithElements[]>();
        nodes
          .map((node: TreeItem) => {
            const nodeId: string = node.id;
            const childElements: TreeItem[] = elementsByParentId.has(nodeId) ? elementsByParentId.get(nodeId) : [];
            return {
              ...node,
              childElements
            };
          })
          .forEach((nodeWithChildElements: NodeWithElements) => {
            const parentId: string = nodeWithChildElements.parentId;
            const existingNodes: NodeWithElements[] = resultMap.has(parentId) ? resultMap.get(parentId) : [];
            resultMap.set(parentId, [...existingNodes, nodeWithChildElements]);
          });
        return resultMap;
      })
    );

    const treeRoot$: Observable<TreeRoot> = nodesWithElementsByParentId$.pipe(
      map((nodesWithElementsByParentId: Map<string, NodeWithElements[]>) => {
        const nodesWithElements: NodeWithElements[] = Array.from(nodesWithElementsByParentId.values()).flat(1);
        const nodeWithChildrenById: Map<string, NodeWithElements | NodeWithChildren> = new Map<
          string,
          NodeWithElements | NodeWithChildren
        >(nodesWithElements.map((node: NodeWithElements) => [node.id, node]));
        nodesWithElements.forEach((node: NodeWithElements) => {
          const childNodes: NodeWithElements[] = nodesWithElementsByParentId
            .get(node.id)
            .map((childNode: NodeWithElements) => nodeWithChildrenById.get(childNode.id));

          Object.defineProperty(node, 'childNodes', {
            value: childNodes,
            configurable: true,
            enumerable: true,
            writable: true
          });
        });

        const nodesWithChildren: NodeWithChildren[] = nodesWithElements.map(
          (node: NodeWithElements | NodeWithChildren): NodeWithChildren => {
            const childNodes: NodeWithElements[] = HierarchicalTree.isNodeWithChildNodes(node) ? node.childNodes : [];
            const childElements: TreeItem[] = HierarchicalTree.isNodeWithChildElements(node) ? node.childElements : [];

            return {
              ...node,
              childElements,
              childNodes
            };
          }
        );

        return nodesWithChildren;
      }),
      map((nodesWithChildren: NodeWithChildren[]) => {
        const rootNodes: NodeWithChildren[] = nodesWithChildren.filter((node: NodeWithChildren) =>
          isNullOrUndefined(node.parentId)
        );
        return rootNodes;
      }),

      withLatestFrom(rootElements$),
      map(([rootNodes, rootElements]: [NodeWithChildren[], TreeItem[]]) => {
        return {
          nodes: rootNodes,
          elements: rootElements
        };
      })
    );

    return treeRoot$.pipe(
      map((treeRoot: TreeRoot) => {
        const { nodes, elements }: TreeRoot = treeRoot;

        const flatTreeElements: FlatTreeItem[] = HierarchicalTree.childElementsToFlatTreeItems(elements);
        const flatTreeNodesWithElements: FlatTreeItem[] = nodes
          .map((node: NodeWithChildren) => HierarchicalTree.nodeWithChildrenToFlatTreeItems(node))
          .flat(1);

        return [...flatTreeNodesWithElements, ...flatTreeElements];
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
    parentItemLevel: number = 0
  ): FlatTreeItem[] {
    const currentLevel: number = parentItemLevel + 1;
    const { isExpandable, name, id, originalData, isElement }: NodeWithChildren = nodeWithChildren;
    const node: FlatTreeItem = new FlatTreeItem(isExpandable, name, currentLevel, id, originalData, isElement);
    const childElements: FlatTreeItem[] = HierarchicalTree.childElementsToFlatTreeItems(
      nodeWithChildren.childElements,
      currentLevel
    );
    const childNodes: FlatTreeItem[] = nodeWithChildren.childNodes
      .map((childNode: NodeWithChildren) => HierarchicalTree.nodeWithChildrenToFlatTreeItems(childNode, currentLevel))
      .flat(1);

    return [node, ...childNodes, ...childElements];
  }

  private static childElementsToFlatTreeItems(childElements: TreeItem[], parentItemLevel: number = 0): FlatTreeItem[] {
    return childElements.map((childElement: TreeItem) => {
      const { isExpandable, name, id, originalData, isElement }: TreeItem = childElement;
      const currentLevel: number = parentItemLevel + 1;
      return new FlatTreeItem(isExpandable, name, currentLevel, id, originalData, isElement);
    });
  }
}
