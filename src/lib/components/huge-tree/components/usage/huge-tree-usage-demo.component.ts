import { HttpResponse } from '@angular/common/http';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { distinctUntilSerializedChanged, filterNotNil } from '@bimeister/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, tap } from 'rxjs/operators';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { HugeTreeItem } from '../../../../../internal/declarations/interfaces/huge-tree-item.interface';
import { HugeTreeItemsQuery } from '../../../../../internal/declarations/interfaces/huge-tree-items-query.interface';
import { HugeTreeRequestParams } from '../../../../../internal/declarations/interfaces/huge-tree-request-params.interface';
import { HugeTreeComponent } from '../api';
import { HugeTreeDemoRequestsService } from '../services/huge-tree-demo-requests.service';

const TREE_ITEM_SIZE_PX: number = 28;
const REQUEST_DELAY_MS: number = 300;
const INITIAL_TOTAL_TREE_ITEMS_LENGTH: number = 1;
const TOTAL_COUNT_HEADER_NAME: string = 'x-visible-total-count';

@Component({
  selector: 'pupa-huge-tree-usage-demo',
  templateUrl: './huge-tree-usage-demo.component.html',
  styleUrls: ['./huge-tree-usage-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugeTreeUsageDemoComponent implements AfterContentInit, OnDestroy {
  @ViewChild('hugeTree', { static: true }) public readonly hugeTree: HugeTreeComponent;

  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  public readonly totalTreeItemsLength$: BehaviorSubject<number> = new BehaviorSubject<number>(
    INITIAL_TOTAL_TREE_ITEMS_LENGTH
  );
  public readonly treeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(null);
  private readonly requestParams$: BehaviorSubject<HugeTreeRequestParams> = new BehaviorSubject<HugeTreeRequestParams>(
    null
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly hugeTreeDemoRequestsService: HugeTreeDemoRequestsService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterContentInit(): void {
    this.subscription.add(this.getSubscriptionForRangeChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processRequestParamsEmit(params: HugeTreeRequestParams): void {
    this.requestParams$.next(params);
  }

  public a(): void {
    this.expandParentByIds(['c7c72951-5c29-464d-ba81-22edf8ea879d', '32f7b74e-1959-4ac0-ac67-b57c449481a8']);
    this.scrollByEntityId(9);
  }
  public scrollByEntityId(index: number): void {
    this.hugeTree.scrollToIndex(index);
  }

  public expandParentByIds(parentIds: string[]): void {
    this.hugeTree.expandParentsByIds(parentIds);
  }

  private setFakeArray(): void {
    this.treeItemsData$.pipe(take(1), filterNotNil()).subscribe((data: FlatHugeTreeItem[]) => {
      const fakeArray: FlatHugeTreeItem[] = new Array(data.length).fill(
        new FlatHugeTreeItem(false, null, null, null, null)
      );
      this.treeItemsData$.next(fakeArray);
    });
  }

  private getSubscriptionForRangeChanges(): Subscription {
    return this.requestParams$
      .pipe(
        filterNotNil(),
        distinctUntilSerializedChanged(),
        tap(() => this.setFakeArray()),
        debounceTime(REQUEST_DELAY_MS),
        switchMap(({ range, expandedItemIds }: HugeTreeRequestParams) => {
          const query: HugeTreeItemsQuery = { expandedItemIds, fromIndex: range.start, toIndex: range.end };

          return this.hugeTreeDemoRequestsService.postTreeItems(query);
        })
      )
      .subscribe((response: HttpResponse<HugeTreeItem[]>) => {
        const { headers, body: data }: HttpResponse<HugeTreeItem[]> = response;

        const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));
        this.totalTreeItemsLength$.next(visibleTotalCount);

        const updatedData: FlatHugeTreeItem[] = data.map(
          (item: HugeTreeItem) =>
            new FlatHugeTreeItem(
              true,
              `Name 🐺: (id: ${item.entityId}) ${item.entityValue}`,
              item.level,
              item.entityId,
              item.parentEntityId
            )
        );

        this.treeItemsData$.next(updatedData);
        this.changeDetectorRef.detectChanges();
      });
  }
}
