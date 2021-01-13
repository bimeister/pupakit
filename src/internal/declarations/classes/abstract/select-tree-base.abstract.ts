import { Directive, EventEmitter, OnChanges, TrackByFunction } from '@angular/core';
import { isNil } from '@bimeister/utilities/common';
import { asyncScheduler, BehaviorSubject, Observable, timer } from 'rxjs';
import { delay, filter, map, observeOn, subscribeOn, switchMap, take, tap } from 'rxjs/operators';
import { TreeType } from '../../enums/tree-type.enum';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
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
export abstract class SelectTreeBase implements TreePropertiesTransfer, OnChanges {
  public abstract readonly customPupaTreeComponent: TreeComponent;
  public abstract readonly hierarchicalTreeComponent: TreeComponent;
  public abstract readonly flatTreeComponent: TreeComponent;

  public readonly isExpanded$: Observable<boolean> = this.selectStateService.isExpanded$;

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

  public abstract isNodeSelectionEnabled: boolean;
  public readonly isNodeSelectionEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly selectedNodesIds$: Observable<Uuid[]> = this.selectStateService.currentValue$;
  public readonly highlightedNodesIds$: Observable<Uuid[]> = this.selectStateService.currentValue$;

  public readonly treeType: typeof TreeType = TreeType;

  public abstract readonly expandedNode: EventEmitter<FlatTreeItem>;

  constructor(public readonly type: TreeType, private readonly selectStateService: SelectStateService<Uuid>) {}

  public readonly trackBy: TrackByFunction<FlatTreeItem> = (index: number, item: FlatTreeItem) => `${index} ${item.id}`;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processIsNodeSelectionEnabled(changes?.isNodeSelectionEnabled);
  }

  public processNodeExpansion(item: FlatTreeItem): void {
    this.expandedNode.emit(item);
  }

  public processNodeClick(item: FlatTreeItem): void {
    const { id, isElement }: FlatTreeItem = item;

    this.isNodeSelectionEnabled$
      .pipe(
        filter(
          (isNodeSelectionEnabled: boolean) =>
            (isElement && !isNodeSelectionEnabled) || (!isElement && isNodeSelectionEnabled)
        ),
        switchMap(() => this.selectedNodesIds$),
        take(1),
        map((selectedNodeIds: Uuid[]) => selectedNodeIds.length === 1 && selectedNodeIds[0] === id)
      )
      .subscribe((isAlreadyNodeIdExist: boolean) =>
        isAlreadyNodeIdExist ? this.selectStateService.collapse() : this.selectStateService.processSelection(id)
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

  private processIsNodeSelectionEnabled(change: ComponentChange<this, boolean>): void {
    const updatedState: boolean | undefined = change?.currentValue;

    if (isNil(updatedState)) {
      return;
    }

    this.isNodeSelectionEnabled$.next(Boolean(updatedState));
  }
}
