import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
  ViewEncapsulation
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { TreeType } from '../../../../../internal/declarations/enums/tree-type.enum';
import { TreeItemInterface } from '../../../../../internal/declarations/interfaces/tree-item.interface';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { TreeComponent } from '../../../tree/components/tree/tree.component';
import { SelectNewStateService } from '../../services/select-new-state.service';

type TreePropertiesTransfer = Pick<
  TreeComponent,
  'flatDataOrigin' | 'treeNodesOrigin' | 'treeElementsOrigin' | 'trackBy' | 'expandedNode'
>;

const MAX_SELECT_TREE_HEIGHT_PX: number = 300;
const TREE_ITEM_SIZE_PX: number = 30;
const EMPTY_SPACE_PX: number = 12;

/** @deprecated remove ViewEncapsulation.None when tree styling is available */
@Component({
  selector: 'pupa-select-new-tree',
  templateUrl: './select-new-tree.component.html',
  styleUrls: ['./select-new-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewTreeComponent implements TreePropertiesTransfer {
  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;

  public readonly adaptiveTreeHeight$: BehaviorSubject<number> = new BehaviorSubject(MAX_SELECT_TREE_HEIGHT_PX);

  /**
   * @description
   * Already flatten tree data source.
   */
  @Input() public readonly flatDataOrigin: FlatTreeItem[] = [];

  /**
   * @description
   * Flatten tree nodes (folders) to be combined with treeElementsOrigin.
   */
  @Input() public readonly treeNodesOrigin: TreeItemInterface[] = [];

  /**
   * @description
   * Flatten tree elements (folder items) to be combined with treeNodesOrigin.
   */
  @Input() public readonly treeElementsOrigin: TreeItemInterface[] = [];

  @Input() public hideRoot: boolean = false;

  public readonly selectedNodesIds$: Observable<Uuid[]> = this.selectNewStateService.currentValue$;
  public readonly highlightedNodesIds$: Observable<Uuid[]> = this.selectNewStateService.currentValue$;

  @Output() public readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();

  constructor(
    @Attribute('type') public readonly type: TreeType,
    private readonly selectNewStateService: SelectNewStateService<Uuid>
  ) {}

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
    const maxAvaliableCount: number = Math.ceil(MAX_SELECT_TREE_HEIGHT_PX / TREE_ITEM_SIZE_PX);
    const adaptiveTreeHeight: number =
      count < maxAvaliableCount ? count * TREE_ITEM_SIZE_PX + EMPTY_SPACE_PX : MAX_SELECT_TREE_HEIGHT_PX;

    this.adaptiveTreeHeight$.next(adaptiveTreeHeight);
  }
}
