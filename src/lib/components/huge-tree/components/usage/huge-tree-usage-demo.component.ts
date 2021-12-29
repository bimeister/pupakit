import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

const TREE_ITEM_SIZE_PX: number = 28;
const REQUEST_DELAY_MS: number = 300;
const INITIAL_TOTAL_TREE_ITEMS_LENGTH: number = 1;

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
  private readonly requestUrl: string = `https://sb16.bimeister.com/api/Trees/output2.csv/TreeItems`;
  private readonly requestHttpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OTY5YjY1NC05NzExLTQ2OWItOGVjZS0yOTcyYjZkMjE0OWEiLCJpc3MiOiJodHRwOi8vd2ViYXBpIiwiaWF0IjoxNjM5NzUzNTMwLCJzaWQiOiJkMGMxZTljZS1lNzI2LTQ2ODctYmZjMi1iYjJmZDY1OTcyY2UiLCJzdWIiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJkaXNwbGF5X25hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciIsInRlbmFudF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInVzZXJfcm9sZSI6ImFkbWluIiwibmJmIjoxNjM5NzUzNTMwLCJleHAiOjE2NDUwMzM1MzAsImF1ZCI6Imh0dHA6Ly9mcm9udGVuZCJ9.MMT0y15p2h4m39AzU6A1corCt92XcXmsIBLGF73z0Ok`,
  });

  public readonly totalTreeItemsLength$: BehaviorSubject<number> = new BehaviorSubject<number>(
    INITIAL_TOTAL_TREE_ITEMS_LENGTH
  );
  public readonly treeItemsData$: BehaviorSubject<FlatHugeTreeItem[]> = new BehaviorSubject<FlatHugeTreeItem[]>(null);
  private readonly requestParams$: BehaviorSubject<HugeTreeRequestParams> = new BehaviorSubject<HugeTreeRequestParams>(
    null
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly httpClient: HttpClient, private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterContentInit(): void {
    this.subscription.add(this.getSubscriptionForRangeChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processRequestParamsEmit(params: HugeTreeRequestParams): void {
    this.requestParams$.next(params);
  }

  public scrollByEntityId(
    index: number = 9,
    parentIds: string[] = ['c7c72951-5c29-464d-ba81-22edf8ea879d', '32f7b74e-1959-4ac0-ac67-b57c449481a8']
  ): void {
    this.hugeTree.scrollToIndexAndExpandParents(index, parentIds);
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

          return this.httpClient.post<any>(this.requestUrl, query, {
            headers: this.requestHttpHeaders,
            observe: 'response',
          });
        })
      )
      .subscribe((response: HttpResponse<Partial<HugeTreeItem[]>>) => {
        const { headers, body: data }: HttpResponse<Partial<HugeTreeItem[]>> = response;

        const visibleTotalCount: number = Number(headers.get('x-visible-total-count'));
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
