import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { HugeTreeState } from '../../../../../internal/declarations/interfaces/huge-tree-state.interface';
import { HugeTreeExpandedItemsService } from '../services/huge-tree-expanded-items.service';

interface ObjectWithLength {
  length: number;
}

const TREE_ITEM_SIZE_PX: number = 32;
const ITEM_BUFFER_COUNT: number = 50;

@Component({
  selector: 'pupa-huge-tree',
  templateUrl: './huge-tree.component.html',
  styleUrls: ['./huge-tree.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HugeTreeExpandedItemsService],
})
export class HugeTreeComponent implements OnChanges, AfterViewInit {
  @ViewChild('viewport', { static: true }) public readonly viewport: CdkVirtualScrollViewport;
  public readonly expandedTreeItemIds$: Observable<string[]> = this.hugeTreeExpandedItemsService.expandedTreeItemIds$;

  public readonly dataObjectWithLength$: BehaviorSubject<ObjectWithLength> = new BehaviorSubject<ObjectWithLength>({
    length: 0,
  });
  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  @Input() public readonly nodeTemplate?: TemplateRef<any>;

  @Input() public selectedNodeId: string;
  public readonly selectedNodeId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public treeItemsData: FlatHugeTreeItem[] = [];
  @Output() public nodeClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() public scrolledByY: EventEmitter<number> = new EventEmitter<number>();

  public treeStateRequestParams$: Observable<HugeTreeState>;

  public readonly bufferPx: number = TREE_ITEM_SIZE_PX * ITEM_BUFFER_COUNT;

  constructor(
    private readonly hugeTreeExpandedItemsService: HugeTreeExpandedItemsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSelectedNodeIdChanges(changes?.selectedNodeId);
  }

  public onScroll(): void {
    const scrollTopPx: number = this.viewport.elementRef.nativeElement.scrollTop;
    this.scrolledByY.emit(scrollTopPx);
  }

  public setScrollTop(scrollTopPx: number): void {
    this.viewport.scrollTo({
      top: scrollTopPx,
    });
  }

  public ngAfterViewInit(): void {
    this.treeStateRequestParams$ = combineLatest([
      this.expandedTreeItemIds$,
      this.viewport.scrolledIndexChange.pipe(startWith(0)),
    ]).pipe(
      switchMap(() => this.getTreeState()),
      distinctUntilChanged((prevState: HugeTreeState, currState: HugeTreeState) => {
        const prevRoundedRange: ListRange = this.roundListRange(prevState.range, prevState.totalCount);
        const currRoundedRange: ListRange = this.roundListRange(currState.range, currState.totalCount);

        return (
          JSON.stringify(prevState.expandedItemIds) === JSON.stringify(currState.expandedItemIds) &&
          prevRoundedRange.end === currRoundedRange.end &&
          prevRoundedRange.start === currRoundedRange.start
        );
      })
    );
  }

  public isExpanded(expandedIds: string[], nodeId: string): boolean {
    return !isNil(nodeId) && expandedIds.includes(nodeId);
  }

  public isSelected(selectedId: string, nodeId: string): boolean {
    if (isNil(selectedId)) {
      return false;
    }
    return !isNil(nodeId) && selectedId === nodeId;
  }

  public toggleExpansion(id: string, parentId: string): void {
    this.hugeTreeExpandedItemsService.toggleExpansion(id, parentId);
  }

  public processClick(id: string): void {
    if (isNil(id)) {
      return;
    }

    this.nodeClicked.emit(id);
  }

  public expandParentsByIds(parentIds: string[]): void {
    this.hugeTreeExpandedItemsService.expandParents(parentIds);
  }

  public closeChildrenByParentId(id: string, withParent: boolean = true): void {
    this.hugeTreeExpandedItemsService.closeChildrenByParentId(id, withParent);
  }

  public closeChildById(parentId: string, id: string): void {
    this.hugeTreeExpandedItemsService.closeChildById(parentId, id);
  }

  public getTreeNodeDataByIndex(index: number, totalTreeItemsLength: number): FlatHugeTreeItem | undefined {
    if (isNil(index) || isEmpty(this.treeItemsData)) {
      return undefined;
    }
    const currentRenderedRange: ListRange = this.viewport.getRenderedRange();
    const roundedRange: ListRange | undefined = this.roundListRange(currentRenderedRange, totalTreeItemsLength);

    const neededIndex: number = isNil(roundedRange) ? index : index - roundedRange.start;

    return this.treeItemsData[neededIndex];
  }

  public getTreeState(): Observable<HugeTreeState> {
    return combineLatest([
      this.expandedTreeItemIds$,
      this.viewport.scrolledIndexChange.pipe(startWith(0)),
      this.dataObjectWithLength$,
    ]).pipe(
      take(1),
      map(([expandedItemIds, currentFirstVisibleIndex, dataObjectWithLength]: [string[], number, ObjectWithLength]) => {
        const actualRange: ListRange = this.viewport.getRenderedRange();
        const totalTreeItemsLength: number = dataObjectWithLength.length;
        const currentTreeItemsLength: number = this.treeItemsData.length;

        return {
          range: actualRange,
          expandedItemIds,
          currentIndex: currentFirstVisibleIndex,
          totalCount: totalTreeItemsLength,
          currentTreeItemsLength,
        };
      })
    );
  }

  public setTreeState(
    totalCount: number,
    treeItems: FlatHugeTreeItem[],
    needToScroll?: boolean,
    indexToScroll?: number
  ): void {
    this.setTreeItemsData(treeItems);

    this.setDataObjectLength(totalCount);

    if (needToScroll) {
      requestAnimationFrame(() => {
        this.viewport.scrollToIndex(indexToScroll);
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  public setTreeItemsData(treeItemsData: FlatHugeTreeItem[]): void {
    if (isEmpty(treeItemsData)) {
      return;
    }

    this.treeItemsData = treeItemsData;
    this.changeDetectorRef.detectChanges();
  }

  public roundListRange(range: ListRange, totalCount: number): ListRange {
    const { start, end }: ListRange = range;

    const countItemsInViewport: number = end - start;
    const minimumRoundValue: number = ITEM_BUFFER_COUNT;

    const numberRankIndex: number = String(countItemsInViewport).length - 1;
    const roundValue: number = Math.max(numberRankIndex * 10, minimumRoundValue);

    const possibleStart: number = start - countItemsInViewport;
    const roundedStart: number = Math.max(Math.round(possibleStart / roundValue) * roundValue, 0);

    const possibleEnd: number = end + countItemsInViewport;
    const serializedTotalCount: number = totalCount ?? start + countItemsInViewport;

    const roundedEnd: number = Math.min(Math.round(possibleEnd / roundValue) * roundValue, serializedTotalCount);
    const convertedEnd: number = roundedEnd === 0 ? roundValue : roundedEnd;

    return { start: roundedStart, end: convertedEnd };
  }

  private setDataObjectLength(length: number): void {
    const objectWithLength: ObjectWithLength = { length };
    this.dataObjectWithLength$.next(objectWithLength);
  }

  private processSelectedNodeIdChanges(change: ComponentChange<this, string>): void {
    const updatedValue: Nullable<string> = change?.currentValue;

    if (updatedValue === undefined) {
      return;
    }

    this.selectedNodeId$.next(updatedValue);
  }
}
