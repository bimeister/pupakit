import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PagedVirtualScrollArguments } from '@bimeister/pupakit.common';
import { PagedVirtualScrollViewportComponent } from '@bimeister/pupakit.widgets';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, delay, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

type DataType = number;

const ROWS_COUNT: number = 500;
const DATA: DataType[] = Array(ROWS_COUNT)
  .fill(1)
  .map((_: number, index: number) => index + 1);

const ITEM_SIZE_REM: number = 8.75;

const DEFAULT_REQUEST_DELAY_MS: number = 200;
const MIN_DEFAULT_REQUEST_DELAY_MS: number = 100;
const SEARCH_DEBOUNCE_TIME_MS: number = 200;

@Component({
  selector: 'demo-paged-virtual-scroll-demo',
  templateUrl: './paged-virtual-scroll-demo.component.html',
  styleUrls: ['./paged-virtual-scroll-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PagedVirtualScrollDemoComponent implements OnDestroy, AfterViewInit {
  @ViewChild('pagedVirtualScrollViewport', { static: false })
  private readonly pagedVirtualScrollViewport: PagedVirtualScrollViewportComponent;

  public readonly itemSize: number = ITEM_SIZE_REM;

  public readonly searchControl: FormControl = new FormControl();
  private readonly searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private readonly data$: Observable<DataType[]> = timer(200).pipe(switchMap(() => of(DATA)));
  public readonly totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly isVisible$: Observable<boolean> = this.totalCount$.pipe(
    map((tasksTotalCount: number) => isNil(tasksTotalCount) || tasksTotalCount > 0)
  );

  public readonly rows$: BehaviorSubject<DataType[]> = new BehaviorSubject<DataType[]>([]);
  private readonly pagedVirtualScrollArguments$: Subject<PagedVirtualScrollArguments> =
    new Subject<PagedVirtualScrollArguments>();
  private readonly firstSliceCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  private readonly subscription: Subscription = new Subscription();
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.subscription
      .add(this.processPagedVirtualScrollArgumentsChanges())
      .add(this.handleSearchEventsToFillSearchValue());
  }

  public readonly trackByFunction: TrackByFunction<DataType> = (_: number, row: DataType): number => row;

  public ngAfterViewInit(): void {
    this.pagedVirtualScrollViewportRefresh();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleChangeDataSource(pagedVirtualScrollArguments: PagedVirtualScrollArguments): void {
    this.pagedVirtualScrollArguments$.next(pagedVirtualScrollArguments);
  }

  public handleChangeFirstSliceCount(firstSliceCount: number): void {
    this.firstSliceCount$.next(firstSliceCount);
  }

  private processPagedVirtualScrollArgumentsChanges(): Subscription {
    return this.pagedVirtualScrollArguments$
      .pipe(
        switchMap((pagedVirtualScrollArguments: PagedVirtualScrollArguments) =>
          this.data$.pipe(
            filterNotNil(),
            take(1),
            withLatestFrom(this.searchValue$),
            map(([data, searchValue]: [DataType[], string]) => {
              const { currentTo, currentFrom }: PagedVirtualScrollArguments = pagedVirtualScrollArguments;

              const filteredData: DataType[] = data.filter((item: number) => `${item - 1}`.includes(searchValue));

              const emptyRows: DataType[] = this.getEmptyRows(currentFrom);
              const newData: DataType[] = filteredData.slice(currentFrom, currentTo);

              const dataToRender: DataType[] = [...emptyRows, ...newData];
              const total: number = filteredData.length;

              return [dataToRender, total];
            }),
            delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
          )
        )
      )
      .subscribe(([dataToRender, total]: [DataType[], number]) => {
        this.rows$.next(dataToRender);
        this.totalCount$.next(total);

        this.detectChanges();
      });
  }

  private getEmptyRows(emptyRowsCount: number): DataType[] {
    return Array(emptyRowsCount).fill(null);
  }

  private handleSearchEventsToFillSearchValue(): Subscription {
    return this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_TIME_MS),
        map((searchTerm: string) => (isEmpty(searchTerm) ? '' : searchTerm.toLowerCase()))
      )
      .subscribe((searchTerm: string) => {
        this.searchValue$.next(searchTerm);
        this.pagedVirtualScrollViewportRefresh();
      });
  }

  private pagedVirtualScrollViewportRefresh(): void {
    this.pagedVirtualScrollViewport.refreshWithScrollToIndex();
    this.resetPaginationVariables();

    this.detectChanges();
  }

  private resetPaginationVariables(): void {
    this.totalCount$.next(null);
    this.rows$.next([]);
  }

  /** @deprecated need research */
  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}
