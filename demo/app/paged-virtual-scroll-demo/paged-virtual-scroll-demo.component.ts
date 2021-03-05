import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { filterNotNil, isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';
import { PagedVirtualScrollArguments } from '../../../src/internal/declarations/interfaces/paged-virtual-scroll-arguments.interface';

type DATA_TYPE = number;

const ROWS_COUNT: number = 500;
const DATA: DATA_TYPE[] = Array(ROWS_COUNT)
  .fill(1)
  .map((_: number, index: number) => index + 1);

const ITEM_SIZE_PX: number = 35;

const DEFAULT_REQUEST_DELAY_MS: number = 200;
const MIN_DEFAULT_REQUEST_DELAY_MS: number = 100;

@Component({
  selector: 'demo-paged-virtual-scroll-demo',
  templateUrl: './paged-virtual-scroll-demo.component.html',
  styleUrls: ['./paged-virtual-scroll-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class PagedVirtualScrollDemoComponent implements OnDestroy {
  public readonly itemSize: number = ITEM_SIZE_PX;

  private readonly data$: Observable<DATA_TYPE[]> = timer(200).pipe(switchMap(() => of(DATA)));
  public readonly totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly isVisible$: Observable<boolean> = this.totalCount$.pipe(
    map((tasksTotalCount: number) => isNil(tasksTotalCount) || tasksTotalCount > 0)
  );

  public readonly rows$: BehaviorSubject<DATA_TYPE[]> = new BehaviorSubject<DATA_TYPE[]>([]);
  private readonly pagedVirtualScrollArguments$: Subject<PagedVirtualScrollArguments> = new Subject<PagedVirtualScrollArguments>();

  private readonly subscription: Subscription = new Subscription();
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
    this.subscription.add(this.processPagedVirtualScrollArgumentsChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleChangeDataSource(pagedVirtualScrollArguments: PagedVirtualScrollArguments): void {
    this.pagedVirtualScrollArguments$.next(pagedVirtualScrollArguments);
  }

  private processPagedVirtualScrollArgumentsChanges(): Subscription {
    return this.pagedVirtualScrollArguments$
      .pipe(
        switchMap((pagedVirtualScrollArguments: PagedVirtualScrollArguments) => {
          return this.data$.pipe(
            filterNotNil(),
            take(1),
            map((data: DATA_TYPE[]) => {
              const { currentTo, currentFrom }: PagedVirtualScrollArguments = pagedVirtualScrollArguments;

              const emptyRows: DATA_TYPE[] = this.getEmptyRows(currentFrom);
              const newData: DATA_TYPE[] = data.slice(currentFrom, currentTo);

              return [...emptyRows, ...newData];
            }),
            delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
          );
        })
      )
      .subscribe((dataToRender: DATA_TYPE[]) => {
        this.rows$.next(dataToRender);
        this.totalCount$.next(DATA.length);
        /** @deprecated need research */
        this.changeDetectorRef.detectChanges();
      });
  }

  private getEmptyRows(emptyRowsCount: number): DATA_TYPE[] {
    return Array(emptyRowsCount).fill(null);
  }
}
