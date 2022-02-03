import { ListRange } from '@angular/cdk/collections';
import { distinctUntilSerializedChanged, filterNotNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, tap, withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../events/table.events';
import { PagedVirtualScrollArguments } from '../interfaces/paged-virtual-scroll-arguments.interface';
import { TablePagedDataProducerOptions } from '../interfaces/table-paged-data-producer-options.interface';
import { ListRangesIntersectionProducer } from './list-ranges-intersection-producer.class';
import { TableController } from './table-controller.class';

const REACT_ON_RANGE_CHANGES_DELAY_MS: number = 500;

export class TablePagedDataProducer<T> {
  private readonly reactRangeChangesTimeMs: number =
    this.options?.reactRangeChangesTimeMs ?? REACT_ON_RANGE_CHANGES_DELAY_MS;
  private readonly bodyInitialCountOfSkeletonRows: number = this.options?.bodyInitialCountOfSkeletonRows;

  private readonly previousListRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>({
    start: null,
    end: null,
  });

  public readonly arguments$: Observable<PagedVirtualScrollArguments> = this.controller
    .getEvents(TableEvents.ListRangeChanged)
    .pipe(
      filterNotNil(),
      map((event: TableEvents.ListRangeChanged) => event.listRange),
      distinctUntilSerializedChanged(),
      filterNotNil(),
      debounceTime(this.reactRangeChangesTimeMs),
      withLatestFrom(this.previousListRange$),
      tap(([currentRange, _previousRange]: [ListRange, ListRange]) => this.previousListRange$.next(currentRange)),
      map(([currentRange, previousRange]: [ListRange, ListRange]) =>
        ListRangesIntersectionProducer.getPagedVirtualScrollArguments(previousRange, currentRange)
      ),
      distinctUntilSerializedChanged()
    );

  constructor(
    private readonly controller: TableController<T>,
    private readonly options?: TablePagedDataProducerOptions
  ) {
    this.controller.setBodyInitialCountOfSkeletonRows(this.bodyInitialCountOfSkeletonRows);
  }
}
