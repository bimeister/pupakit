import { Injectable } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ExpandedTreeItem } from '../classes/expanded-tree-item.class';

@Injectable()
export class HugeTreeExpandedItemsService {
  private readonly expandedTreeItemsByIdMap$: BehaviorSubject<Map<string, ExpandedTreeItem>> = new BehaviorSubject(
    new Map<string, ExpandedTreeItem>()
  );
  public readonly expandedTreeItemIds$: Observable<string[]> = this.expandedTreeItemsByIdMap$.pipe(
    map((expandedItemsMap: Map<string, ExpandedTreeItem>) => Array.from(expandedItemsMap.keys()))
  );

  public toggleExpansion(id: string, parentId: string): void {
    this.expandedTreeItemsByIdMap$.pipe(take(1)).subscribe((expandedTreeItemsMap: Map<string, ExpandedTreeItem>) => {
      const updatedMap: Map<string, ExpandedTreeItem> = new Map<string, ExpandedTreeItem>(expandedTreeItemsMap);

      const expandedItem: ExpandedTreeItem | undefined = updatedMap.get(id);

      if (!isNil(expandedItem)) {
        expandedItem.getAllChildrenIds().forEach((childId: string) => updatedMap.delete(childId));
        updatedMap.delete(id);

        this.expandedTreeItemsByIdMap$.next(updatedMap);

        return;
      }

      const newExpandedTreeItem: ExpandedTreeItem = new ExpandedTreeItem(id);

      const parentTreeItem: ExpandedTreeItem | undefined = updatedMap.get(parentId);

      const parentTreeItemFound: boolean = !isNil(parentTreeItem);

      parentTreeItemFound
        ? parentTreeItem.setChild(newExpandedTreeItem)
        : newExpandedTreeItem.setParent(new ExpandedTreeItem(parentId));

      updatedMap.set(id, newExpandedTreeItem);

      this.expandedTreeItemsByIdMap$.next(updatedMap);
    });
  }

  public expandParents(parentIds: string[]): void {
    this.expandedTreeItemsByIdMap$.pipe(take(1)).subscribe((expandedTreeItemsMap: Map<string, ExpandedTreeItem>) => {
      const updatedMap: Map<string, ExpandedTreeItem> = new Map<string, ExpandedTreeItem>(expandedTreeItemsMap);

      const nearestParentId: string = parentIds[parentIds.length - 1];
      const nearestParentExpandedItem: ExpandedTreeItem | undefined = updatedMap.get(nearestParentId);
      const nearestParentTreeItemFound: boolean = !isNil(nearestParentExpandedItem);
      if (isEmpty(parentIds) || nearestParentTreeItemFound) {
        return;
      }

      parentIds.forEach((parentId: string, index: number) => {
        if (updatedMap.has(parentId)) {
          return;
        }
        const newExpandedTreeItem: ExpandedTreeItem = new ExpandedTreeItem(parentId);

        const nextParentId: string = parentIds[index + 1];
        if (!isNil(nextParentId)) {
          const nextParentExpandedTreeItem: ExpandedTreeItem = new ExpandedTreeItem(nextParentId);
          newExpandedTreeItem.setChild(nextParentExpandedTreeItem);
        }

        const previousParentId: string = parentIds[index - 1];
        if (!isNil(previousParentId)) {
          const previousParentExpandedTreeItem: ExpandedTreeItem = new ExpandedTreeItem(previousParentId);
          newExpandedTreeItem.setParent(previousParentExpandedTreeItem);
        }

        updatedMap.set(parentId, newExpandedTreeItem);
      });

      this.expandedTreeItemsByIdMap$.next(updatedMap);
    });
  }
}
