import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { distinctUntilSerializedChanged, isEmpty, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { HugeTreeRequestParams } from '../../../../../internal/declarations/interfaces/huge-tree-request-params.interface';
import { HugeTreeState } from '../../../../../internal/declarations/interfaces/huge-tree-state.interface';
import { HugeTreeExpandedItemsService } from '../services/huge-tree-expanded-items.service';

interface ObjectWithLength {
  length: number;
}

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

  @Input() public totalTreeItemsLength: number;
  public readonly dataObjectWithLength$: BehaviorSubject<ObjectWithLength> = new BehaviorSubject<ObjectWithLength>({
    length: 0,
  });
  @Input() public treeItemSizePx: number;
  public readonly treeItemSizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  @Input() public treeItemsData: FlatHugeTreeItem[];
  public readonly treeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(null);

  @Output() public requestParams: EventEmitter<HugeTreeRequestParams> = new EventEmitter<HugeTreeRequestParams>();
  @Output() public treeState: EventEmitter<HugeTreeState> = new EventEmitter<HugeTreeState>();

  public readonly bufferPx$: Observable<number> = this.treeItemSizePx$.pipe(
    map((sizePx: number) => sizePx * ITEM_BUFFER_COUNT),
    shareReplayWithRefCount()
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly hugeTreeExpandedItemsService: HugeTreeExpandedItemsService) {}
  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTreeItemSizeChanges(changes?.treeItemSizePx);
    this.processObjectLengthChanges(changes?.totalTreeItemsLength);
    this.processTreeItemsDataChanges(changes?.treeItemsData);
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.emitRequestParamsChanges());
  }
  public isExpanded(expandedIds: string[], id: string): boolean {
    return !isNil(id) && expandedIds.includes(id);
  }

  public toggleExpansion(id: string, parentId: string): void {
    this.hugeTreeExpandedItemsService.toggleExpansion(id, parentId);
  }

  public expandParentsByIds(parentIds: string[]): void {
    this.hugeTreeExpandedItemsService.expandParents(parentIds);
  }

  public scrollToIndex(index: number): void {
    this.viewport.scrollToIndex(index);
  }

  private setDataObjectLength(length: number): void {
    const objectWithLength: ObjectWithLength = { length };
    this.dataObjectWithLength$.next(objectWithLength);
  }

  private processTreeItemSizeChanges(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.treeItemSizePx$.next(updatedValue);
  }

  private processObjectLengthChanges(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.setDataObjectLength(updatedValue);
  }

  private processTreeItemsDataChanges(change: ComponentChange<this, FlatHugeTreeItem[]>): void {
    const updatedValue: FlatHugeTreeItem[] | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.treeItemsData$.next(updatedValue);
  }

  public getTreeNodeDataByIndex(index: number): FlatHugeTreeItem | undefined {
    if (isNil(index) || isEmpty(this.treeItemsData)) {
      return undefined;
    }
    const currentRenderedRange: ListRange = this.viewport.getRenderedRange();
    const roundedRange: ListRange | undefined = this.roundListRange(currentRenderedRange, this.totalTreeItemsLength);

    const neededIndex: number = isNil(roundedRange) ? index : index - roundedRange.start;

    return this.treeItemsData[neededIndex];
  }

  public getTreeState(): Observable<HugeTreeState> {
    return combineLatest([this.expandedTreeItemIds$, this.viewport.scrolledIndexChange.pipe(startWith(0))]).pipe(
      map(([expandedItemIds, currentFirstVisibleIndex]: [string[], number]) => {
        const actualRange: ListRange = this.viewport.getRenderedRange();
        return {
          range: actualRange,
          expandedItemIds,
          currentIndex: currentFirstVisibleIndex,
          totalCount: this.totalTreeItemsLength,
        };
      })
    );
  }

  public setTreeState(treeState: HugeTreeState, treeItems: FlatHugeTreeItem[], needToScroll?: boolean): void {
    this.treeItemsData = treeItems;

    if (needToScroll) {
      this.viewport.scrollToIndex(treeState.currentIndex);
    }
  }

  private emitRequestParamsChanges(): Subscription {
    return combineLatest([this.expandedTreeItemIds$, this.viewport.scrolledIndexChange, this.dataObjectWithLength$])
      .pipe(distinctUntilSerializedChanged())
      .subscribe(([expandedItemIds, _, objectWithLength]: [string[], number, ObjectWithLength]) => {
        const renderedRange: ListRange = this.viewport.getRenderedRange();
        const roundedRange: ListRange = this.roundListRange(renderedRange, objectWithLength.length);
        console.log('renderedRange: ', renderedRange);
        console.log('roundedRange: ', roundedRange);
        this.requestParams.emit({ range: roundedRange, expandedItemIds });
      });
  }

  private roundListRange(range: ListRange, totalCount: number): ListRange {
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
}
