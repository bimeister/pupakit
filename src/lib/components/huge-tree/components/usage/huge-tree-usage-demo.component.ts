import { ListRange } from '@angular/cdk/collections';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { isEqual } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { VOID } from '../../../../../internal/api';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { HugeTreeItem } from '../../../../../internal/declarations/interfaces/huge-tree-item.interface';
import { HugeTreeItemsQuery } from '../../../../../internal/declarations/interfaces/huge-tree-items-query.interface';
import { HugeTreeState } from '../../../../../internal/declarations/interfaces/huge-tree-state.interface';
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
export class HugeTreeUsageDemoComponent implements OnDestroy {
  @ViewChild('hugeTree', { static: true }) public readonly hugeTree: HugeTreeComponent;

  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  public readonly totalTreeItemsLength$: BehaviorSubject<number> = new BehaviorSubject<number>(
    INITIAL_TOTAL_TREE_ITEMS_LENGTH
  );
  public readonly currentTreeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(
    []
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly hugeTreeDemoRequestsService: HugeTreeDemoRequestsService) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processTreeUpdateNeeded(): void {
    this.hugeTree
      .getTreeState()
      .pipe(debounceTime(REQUEST_DELAY_MS), take(1))
      .subscribe((treeState: HugeTreeState) => {
        console.log('treeState upd need?: ', treeState);

        const initialRequestOrEmptyTree: boolean = treeState.range.end === 0;

        if (initialRequestOrEmptyTree) {
          this.processInitialDataRequest(treeState);
          return;
        }

        this.setTreeState(treeState);
      });
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

  public expandParentByIdsAndScroll(parentIds: string[], entityId: string): void {
    this.hugeTree
      .getTreeState()
      .pipe(
        debounceTime(REQUEST_DELAY_MS),
        take(1),
        switchMap((treeState: HugeTreeState) => {
          const updatedExpandedIds: string[] = Array.from(new Set([...treeState.expandedItemIds, ...parentIds]));
          const updatedState: HugeTreeState = { ...treeState, expandedItemIds: updatedExpandedIds };
          const treeQueryParams: HugeTreeItemsQuery = {
            expandedItemIds: updatedState.expandedItemIds,
            fromIndex: updatedState.range.start,
            toIndex: updatedState.range.end,
          };

          return combineLatest([
            this.hugeTreeDemoRequestsService.postIndex(entityId, updatedExpandedIds),
            this.hugeTreeDemoRequestsService.postTreeItems(treeQueryParams),
            of(updatedState),
          ]);
        }),
        switchMap(
          ([entityIndex, treeItemsResponse, treeState]: [number, HttpResponse<HugeTreeItem[]>, HugeTreeState]) => {
            const { headers }: HttpResponse<HugeTreeItem[]> = treeItemsResponse;
            const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

            const updatedRange: ListRange = this.hugeTree.roundListRange(
              { start: entityIndex, end: entityIndex > treeState.range.end ? treeState.range.end : entityIndex + 100 },
              visibleTotalCount
            );

            const treeQueryParams: HugeTreeItemsQuery = {
              expandedItemIds: treeState.expandedItemIds,
              fromIndex: updatedRange.start,
              toIndex: updatedRange.end,
            };

            return combineLatest([
              this.hugeTreeDemoRequestsService.postTreeItems(treeQueryParams),
              of(entityIndex),
              this.currentTreeItemsData$,
            ]);
          }
        )
      )
      .subscribe(
        ([response, entityIndex, currentTreeItemsData]: [HttpResponse<HugeTreeItem[]>, number, FlatHugeTreeItem[]]) => {
          const { headers, body: responseData }: HttpResponse<HugeTreeItem[]> = response;
          const updatedTreeItemsData: FlatHugeTreeItem[] = responseData.map(
            (item: HugeTreeItem) =>
              new FlatHugeTreeItem(
                true,
                `Name 🍟: (id: ${item.entityId}) ${item.entityValue}`,
                item.level,
                item.entityId,
                item.parentEntityId
              )
          );

          if (isEqual(updatedTreeItemsData, currentTreeItemsData)) {
            return;
          }

          const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

          this.currentTreeItemsData$.next(updatedTreeItemsData);

          this.hugeTree.setTreeState(visibleTotalCount, updatedTreeItemsData, entityIndex, true);

          this.hugeTree.expandParentsByIds(parentIds);
        }
      );
  }

  private processInitialDataRequest(hugeTreeState: HugeTreeState): void {
    const { range, expandedItemIds }: HugeTreeState = hugeTreeState;
    const treeQueryParams: HugeTreeItemsQuery = { expandedItemIds, fromIndex: range.start, toIndex: range.end };

    this.hugeTreeDemoRequestsService
      .postTreeItems(treeQueryParams)
      .subscribe((response: HttpResponse<HugeTreeItem[]>) => {
        const { headers }: HttpResponse<HugeTreeItem[]> = response;

        const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

        if (visibleTotalCount === 0) {
          return of(VOID);
        }

        const updatedTreeState: HugeTreeState = { ...hugeTreeState, totalCount: visibleTotalCount };

        this.setTreeState(updatedTreeState);
      });
  }

  private setTreeState({ range, expandedItemIds, totalCount }: HugeTreeState): void {
    const roundedRange: ListRange = this.hugeTree.roundListRange(range, totalCount);
    const treeQueryParams: HugeTreeItemsQuery = {
      expandedItemIds,
      fromIndex: roundedRange.start,
      toIndex: roundedRange.end,
    };

    this.hugeTreeDemoRequestsService
      .postTreeItems(treeQueryParams)
      .pipe(withLatestFrom(this.currentTreeItemsData$))
      .subscribe(([response, currentTreeItemsData]: [HttpResponse<HugeTreeItem[]>, FlatHugeTreeItem[]]) => {
        const { headers, body: responseData }: HttpResponse<HugeTreeItem[]> = response;
        const updatedTreeItemsData: FlatHugeTreeItem[] = responseData.map(
          (item: HugeTreeItem) =>
            new FlatHugeTreeItem(
              true,
              `Name 🍟: (id: ${item.entityId}) ${item.entityValue}`,
              item.level,
              item.entityId,
              item.parentEntityId
            )
        );

        if (isEqual(updatedTreeItemsData, currentTreeItemsData)) {
          return;
        }
        const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

        this.currentTreeItemsData$.next(updatedTreeItemsData);

        this.hugeTree.setTreeState(visibleTotalCount, updatedTreeItemsData);
      });
  }

  // private setFakeArray(): void {
  //   this.treeItemsData$.pipe(take(1), filterNotEmpty()).subscribe((data: FlatHugeTreeItem[]) => {
  //     const fakeArray: FlatHugeTreeItem[] = new Array(data.length).fill(
  //       new FlatHugeTreeItem(false, null, null, null, null)
  //     );
  //     this.treeItemsData$.next(fakeArray);
  //   });
  // }
}
