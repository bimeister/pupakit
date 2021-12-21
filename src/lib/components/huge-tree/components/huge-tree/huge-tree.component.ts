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
import { map, take } from 'rxjs/operators';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { HugeTreeRequestParams } from '../../../../../internal/declarations/interfaces/huge-tree-request-params.interface';
import { ExpandedTreeItem } from '../classes/expanded-tree-item.class';

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
})
export class HugeTreeComponent implements OnChanges, AfterViewInit {
  @ViewChild('viewport', { static: true }) public readonly viewport: CdkVirtualScrollViewport;
  public readonly expandedTreeItemsByIdMap$: BehaviorSubject<Map<string, ExpandedTreeItem>> = new BehaviorSubject(
    new Map<string, ExpandedTreeItem>()
  );
  public readonly expandedTreeItemIds$: Observable<string[]> = this.expandedTreeItemsByIdMap$.pipe(
    map((expandedItemsMap: Map<string, ExpandedTreeItem>) => Array.from(expandedItemsMap.keys()))
  );

  @Input() public totalTreeItemsLength: number;
  public readonly dataObjectWithLength$: BehaviorSubject<ObjectWithLength> = new BehaviorSubject<ObjectWithLength>({
    length: 0,
  });
  @Input() public treeItemSizePx: number;
  public readonly treeItemSizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  @Input() public treeItemsData: FlatHugeTreeItem[];
  public readonly treeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(null);

  @Output() public requestParams: EventEmitter<HugeTreeRequestParams> = new EventEmitter<HugeTreeRequestParams>();

  public readonly bufferPx$: Observable<number> = this.treeItemSizePx$.pipe(
    map((sizePx: number) => sizePx * ITEM_BUFFER_COUNT),
    shareReplayWithRefCount()
  );

  private readonly subscription: Subscription = new Subscription();

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
    this.expandedTreeItemsByIdMap$.pipe(take(1)).subscribe((expandedTreeItemsMap: Map<string, ExpandedTreeItem>) => {
      const updatedMap: Map<string, ExpandedTreeItem> = new Map<string, ExpandedTreeItem>(expandedTreeItemsMap);

      const expandedItem: ExpandedTreeItem | undefined = updatedMap.get(id);

      if (isNil(expandedItem)) {
        const newExpandedTreeItem: ExpandedTreeItem = new ExpandedTreeItem(id);

        const parentTreeItem: ExpandedTreeItem | undefined = updatedMap.get(parentId);

        const parentTreeItemFound: boolean = !isNil(parentTreeItem);

        parentTreeItemFound
          ? parentTreeItem.setChild(newExpandedTreeItem)
          : newExpandedTreeItem.setParent(new ExpandedTreeItem(parentId));

        updatedMap.set(id, newExpandedTreeItem);
        this.expandedTreeItemsByIdMap$.next(updatedMap);
        return;
      }
      expandedItem.getAllChildrenIds().forEach((childId: string) => updatedMap.delete(childId));
      updatedMap.delete(id);

      this.expandedTreeItemsByIdMap$.next(updatedMap);
    });
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

  private emitRequestParamsChanges(): Subscription {
    return combineLatest([this.expandedTreeItemIds$, this.viewport.scrolledIndexChange, this.dataObjectWithLength$])
      .pipe(distinctUntilSerializedChanged())
      .subscribe(([expandedItemIds, _, objectWithLength]: [string[], number, ObjectWithLength]) => {
        const renderedRange: ListRange = this.viewport.getRenderedRange();
        const roundedRange: ListRange = this.roundListRange(renderedRange, objectWithLength.length);
        this.requestParams.emit({ range: roundedRange, expandedItemIds });
      });
  }

  private roundListRange(range: ListRange, totalCount: number): ListRange | undefined {
    if (isNil(totalCount)) {
      return undefined;
    }
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
