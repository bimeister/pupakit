import { ListRange } from '@angular/cdk/collections';
import { distinctUntilSerializedChanged, filterNotNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { isNil } from '@bimeister/utilities/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, tap, withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../events/table.events';
import { TablePagedDataProducerOptions } from '../interfaces/table-paged-data-producer-options.interface';
import { TableController } from './table-controller.class';
import { PagedVirtualScrollArguments, ListRangesIntersectionProducer } from '@bimeister/pupakit.common';

const DEFAULT_LIST_RANGE_CHANGES_DEBOUNCE_TIME_MS: number = 500;
const DEFAULT_ROWS_BUFFER_SIZE: number = 200;

export class TablePagedDataProducer<T> {
  private readonly bodyInitialCountOfSkeletonRows: number = this.options?.bodyInitialCountOfSkeletonRows;

  private readonly listRangeChangesDebounceTimeMs: number =
    this.options?.listRangeChangesDebounceTimeMs ?? DEFAULT_LIST_RANGE_CHANGES_DEBOUNCE_TIME_MS;

  private readonly rowsBufferSize: number = this.options?.rowsBufferSize ?? DEFAULT_ROWS_BUFFER_SIZE;

  private readonly loadedSlice$: BehaviorSubject<ListRange | null> = new BehaviorSubject<ListRange | null>(null);

  public readonly arguments$: Observable<PagedVirtualScrollArguments> = this.controller
    .getEvents(TableEvents.ListRangeChanged)
    .pipe(
      filterNotNil(),
      map(({ listRange }: TableEvents.ListRangeChanged) => listRange),
      distinctUntilSerializedChanged(),
      debounceTime(this.listRangeChangesDebounceTimeMs),
      withLatestFrom(this.loadedSlice$),
      map(([visibleSlice, loadedSlice]: [ListRange, ListRange | null]) =>
        TablePagedDataProducer.getSliceToLoad(this.rowsBufferSize, visibleSlice, loadedSlice)
      ),
      filterNotNil(),
      distinctUntilSerializedChanged(),
      withLatestFrom(this.loadedSlice$),
      tap(([sliceToLoad]: [ListRange, ListRange]) => this.loadedSlice$.next(sliceToLoad)),
      map(([sliceToLoad, loadedSlice]: [ListRange, ListRange]) =>
        ListRangesIntersectionProducer.getPagedVirtualScrollArguments(loadedSlice, sliceToLoad)
      ),
      shareReplayWithRefCount()
    ) as Observable<PagedVirtualScrollArguments>;

  constructor(
    private readonly controller: TableController<T>,
    private readonly options?: TablePagedDataProducerOptions
  ) {
    this.controller.setBodyInitialCountOfSkeletonRows(this.bodyInitialCountOfSkeletonRows);
  }

  private static getSliceToLoad(
    rowsBufferSize: number,
    visibleSlice: ListRange,
    loadedSlice: ListRange | null = null
  ): ListRange | undefined {
    if (isNil(loadedSlice)) {
      return TablePagedDataProducer.getSliceToLoadByVisibleSlice(visibleSlice, rowsBufferSize);
    }

    const needToLoadNewSlice: boolean = TablePagedDataProducer.isFirstSliceReachedSecond(visibleSlice, loadedSlice);
    if (!needToLoadNewSlice) {
      return;
    }

    return TablePagedDataProducer.getSliceToLoadByVisibleSlice(visibleSlice, rowsBufferSize);
  }

  private static getSliceToLoadByVisibleSlice(visibleSlice: ListRange, rowsBufferSize: number): ListRange {
    const visibleSliceRowsCount: number = Math.floor(visibleSlice.end - visibleSlice.start);

    if (rowsBufferSize < visibleSliceRowsCount) {
      return {
        start: visibleSlice.start,
        end: visibleSlice.end,
      };
    }

    const halfRowsBufferSize: number = Math.floor(rowsBufferSize / 2);

    if (visibleSlice.start >= halfRowsBufferSize) {
      return {
        start: visibleSlice.start - halfRowsBufferSize,
        end: visibleSlice.start + halfRowsBufferSize,
      };
    }

    if (visibleSlice.end >= halfRowsBufferSize) {
      return {
        start: 0,
        end: rowsBufferSize,
      };
    }

    return {
      start: 0,
      end: halfRowsBufferSize,
    };
  }

  private static isFirstSliceReachedSecond(firstSlice: ListRange, secondSlice: ListRange): boolean {
    const { getFrom, getTo }: PagedVirtualScrollArguments =
      ListRangesIntersectionProducer.getPagedVirtualScrollArguments(secondSlice, firstSlice);

    return !isNil(getFrom) && !isNil(getTo);
  }
}
