import { ListRange } from '@angular/cdk/collections';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { isEqual } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { delay, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { VOID } from '../../../../../internal/api';
import { FlatHugeTreeItem } from '../../../../../internal/declarations/classes/flat-huge-tree-item.class';
import { HugeTreeItem } from '../../../../../internal/declarations/interfaces/huge-tree-item.interface';
import { HugeTreeItemsQuery } from '../../../../../internal/declarations/interfaces/huge-tree-items-query.interface';
import { HugeTreeState } from '../../../../../internal/declarations/interfaces/huge-tree-state.interface';
import { HugeTreeComponent } from '../huge-tree/huge-tree.component';
import { HugeTreeDemoRequestsService } from '../services/huge-tree-demo-requests.service';

const TREE_ITEM_SIZE_PX: number = 28;
const REQUEST_DELAY_MS: number = 300;
const TOTAL_COUNT_HEADER_NAME: string = 'x-visible-total-count';

@Component({
  selector: 'pupa-huge-tree-usage-demo',
  templateUrl: './huge-tree-usage-demo.component.html',
  styleUrls: ['./huge-tree-usage-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugeTreeUsageDemoComponent {
  @ViewChild(HugeTreeComponent, { static: true }) public readonly hugeTree: HugeTreeComponent;

  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  private readonly currentTreeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(
    []
  );

  constructor(private readonly hugeTreeDemoRequestsService: HugeTreeDemoRequestsService) {}

  public processTreeUpdateNeeded(): void {
    this.hugeTree
      .getTreeState()
      .pipe(
        tap(({ currentTreeItemsLength }: HugeTreeState) => this.setFakeArray(currentTreeItemsLength)),
        delay(REQUEST_DELAY_MS),
        take(1)
      )
      .subscribe((treeState: HugeTreeState) => {
        const initialRequestOrEmptyTree: boolean = treeState.range.end === 0;

        if (initialRequestOrEmptyTree) {
          this.processInitialDataRequest(treeState);
          return;
        }

        this.setTreeState(treeState);
      });
  }

  public hardCodeScroll1(): void {
    const someElementId: string = '19baee1f-e883-44f9-b841-f52a2a73ccfe';
    const someElementParentIds: string[] = [
      'c7c72951-5c29-464d-ba81-22edf8ea879d',
      '205f847d-4aad-4e9b-8537-1eafa8d7d329',
    ];

    this.expandParentByIdsAndScroll(someElementParentIds, someElementId);
  }

  public hardCodeScroll2(): void {
    const someElementId: string = '3284558e-73ae-4e1f-84ae-dba123046c9b';
    const someElementParentIds: string[] = [
      'c7c72951-5c29-464d-ba81-22edf8ea879d',
      '61cc67b4-9938-4300-abe4-b3b378cf25cc',
      '6ead6b0b-29cc-4ab7-8944-2abd6cbac8ad',
      '0a043e42-d1fc-4695-9af8-551d8a305713',
    ];

    this.expandParentByIdsAndScroll(someElementParentIds, someElementId);
  }

  public expandParentByIdsAndScroll(parentIds: string[], entityId: string): void {
    this.hugeTree
      .getTreeState()
      .pipe(
        tap(({ currentTreeItemsLength }: HugeTreeState) => this.setFakeArray(currentTreeItemsLength)),
        delay(REQUEST_DELAY_MS),
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
        take(1),
        switchMap(
          ([entityIndex, treeItemsResponse, treeState]: [number, HttpResponse<HugeTreeItem[]>, HugeTreeState]) => {
            const { headers }: HttpResponse<HugeTreeItem[]> = treeItemsResponse;
            const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

            const updatedRange: ListRange = this.hugeTree.roundListRange(
              { start: entityIndex, end: entityIndex < treeState.range.end ? treeState.range.end : entityIndex },
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
        ),
        take(1)
      )
      .subscribe(
        ([response, entityIndex, currentTreeItemsData]: [HttpResponse<HugeTreeItem[]>, number, FlatHugeTreeItem[]]) => {
          const { headers, body: responseData }: HttpResponse<HugeTreeItem[]> = response;
          const updatedTreeItemsData: FlatHugeTreeItem[] = responseData.map(
            (item: HugeTreeItem) =>
              new FlatHugeTreeItem(
                item.entityId,
                item.parentEntityId,
                `Name 🍟: (id: ${item.entityId}) ${item.entityValue}`,
                item.level
              )
          );

          if (isEqual(updatedTreeItemsData, currentTreeItemsData)) {
            this.hugeTree.setTreeItemsData(currentTreeItemsData);
            return;
          }

          const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

          this.currentTreeItemsData$.next(updatedTreeItemsData);

          this.hugeTree.expandParentsByIds(parentIds);

          this.hugeTree.setTreeState(visibleTotalCount, updatedTreeItemsData, true, entityIndex);
        }
      );
  }

  private setFakeArray(arrayLength: number): void {
    const fakeArray: FlatHugeTreeItem[] = new Array(arrayLength).fill(new FlatHugeTreeItem(null, null, null, null));
    this.hugeTree.setTreeItemsData(fakeArray);
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
              item.entityId,
              item.parentEntityId,
              `Name 🍟: (id: ${item.entityId}) ${item.entityValue}`,
              item.level
            )
        );

        if (isEqual(updatedTreeItemsData, currentTreeItemsData)) {
          this.hugeTree.setTreeItemsData(currentTreeItemsData);
          return;
        }
        const visibleTotalCount: number = Number(headers.get(TOTAL_COUNT_HEADER_NAME));

        this.currentTreeItemsData$.next(updatedTreeItemsData);

        this.hugeTree.setTreeState(visibleTotalCount, updatedTreeItemsData);
      });
  }
}
