import { Directive, EventEmitter, TrackByFunction } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable, timer } from 'rxjs';
import { delay, map, observeOn, subscribeOn, take, tap } from 'rxjs/operators';

import { TreeType } from '../../enums/tree-type.enum';
import { SelectStateService } from '../../interfaces/select-state-service.interface';
import { TreeItemInterface } from '../../interfaces/tree-item.interface';
import { Uuid } from '../../types/uuid.type';
import { FlatTreeItem } from '../flat-tree-item.class';
import { TreeComponent } from './../../../../lib/components/tree/components/tree/tree.component';

type TreePropertiesTransfer = Pick<
  TreeComponent,
  'flatDataOrigin' | 'treeNodesOrigin' | 'treeElementsOrigin' | 'trackBy' | 'expandedNode'
>;

const MAX_SELECT_TREE_HEIGHT_PX: number = 300;
const TREE_ITEM_SIZE_PX: number = 30;
const EMPTY_SPACE_PX: number = 12;

@Directive()
export abstract class SelectTreeBase implements TreePropertiesTransfer {
  public abstract readonly customPupaTreeComponent: TreeComponent;
  public abstract readonly hierarchicalTreeComponent: TreeComponent;
  public abstract readonly flatTreeComponent: TreeComponent;

  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;

  public readonly adaptiveTreeHeight$: BehaviorSubject<number> = new BehaviorSubject(MAX_SELECT_TREE_HEIGHT_PX);

  /**
   * @description
   * Already flatten tree data source.
   */
  public abstract flatDataOrigin: FlatTreeItem[];

  /**
   * @description
   * Flatten tree nodes (folders) to be combined with treeElementsOrigin.
   */
  public abstract treeNodesOrigin: TreeItemInterface[];

  /**
   * @description
   * Flatten tree elements (folder items) to be combined with treeNodesOrigin.
   */
  public abstract treeElementsOrigin: TreeItemInterface[];

  public abstract hideRoot: boolean;
  public abstract isLoading: boolean;

  public readonly selectedNodesIds$: Observable<Uuid[]> = this.selectNewStateService.currentValue$;
  public readonly highlightedNodesIds$: Observable<Uuid[]> = this.selectNewStateService.currentValue$;

  public readonly treeType: typeof TreeType = TreeType;

  public abstract readonly expandedNode: EventEmitter<FlatTreeItem>;

  constructor(public readonly type: TreeType, private readonly selectNewStateService: SelectStateService<Uuid>) {}

  public readonly trackBy: TrackByFunction<FlatTreeItem> = (index: number, item: FlatTreeItem) => `${index} ${item.id}`;

  public processNodeExpansion(item: FlatTreeItem): void {
    this.expandedNode.emit(item);
  }

  public processNodeClick(item: FlatTreeItem): void {
    const { isElement, id }: FlatTreeItem = item;
    if (!isElement) {
      return;
    }
    this.selectedNodesIds$
      .pipe(
        take(1),
        map((selectedNodeIds: Uuid[]) => selectedNodeIds.length === 1 && selectedNodeIds[0] === id)
      )
      .subscribe((isAlreadyNodeIdExist: boolean) =>
        isAlreadyNodeIdExist ? this.selectNewStateService.collapse() : this.selectNewStateService.processSelection(id)
      );
  }

  public processClick(event: Event): void {
    event.stopPropagation();
  }

  public handleCountOfVisibleElementsChanges(count: number): void {
    timer(0, asyncScheduler)
      .pipe(
        observeOn(asyncScheduler),
        subscribeOn(asyncScheduler),
        map(() => {
          const maxAvailableCount: number = Math.ceil(MAX_SELECT_TREE_HEIGHT_PX / TREE_ITEM_SIZE_PX);
          return count < maxAvailableCount ? count * TREE_ITEM_SIZE_PX + EMPTY_SPACE_PX : MAX_SELECT_TREE_HEIGHT_PX;
        }),
        take(1),
        tap((adaptiveTreeHeight: number) => this.adaptiveTreeHeight$.next(adaptiveTreeHeight)),
        delay(100)
      )
      .subscribe(() => {
        switch (this.type) {
          case TreeType.Flat: {
            this.flatTreeComponent.refreshViewPort();
            break;
          }
          case TreeType.Hierarchical: {
            this.hierarchicalTreeComponent.refreshViewPort();
            break;
          }
          case TreeType.Custom: {
            this.customPupaTreeComponent.refreshViewPort();
            break;
          }
          default: {
            return;
          }
        }
      });
  }
}
