import { TrackByFunction, Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterNotNil, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { InfinityScrollerSliceIndexesProducer } from '../../../internal/declarations/classes/infinity-scroller-slice-indexes-producer.class';
import { TableDataDisplayCollection } from '../../../internal/declarations/classes/table-data-display-collection.class';
import { InfinityScrollerOptions } from '../../../internal/declarations/interfaces/infinity-scroller-options.interface';
import { ScrollMoveDirection } from '../../../internal/declarations/enums/scroll-move-direction.enum';
import { InfinityScrollerEvents } from '../../../internal/declarations/events/infinity-scroller.events';
import { InfinityScrollerPaginationConfig } from '../../../internal/declarations/interfaces/infinity-scroller-pagination-config.interface';

type FetchEvent = InfinityScrollerEvents.GetNextPage | InfinityScrollerEvents.GetPreviousPage;

export class InfinityScrollerController<T> {
  public readonly eventBus: EventBus = new EventBus();

  public readonly scrollMoveDirection: ScrollMoveDirection;
  public readonly bufferSize: Nullable<number>;

  public readonly data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly total$: Observable<number> = this.data$.pipe(map((data: T[]) => data.length));
  public readonly isEmpty$: Observable<boolean> = this.data$.pipe(map((data: T[]) => isEmpty(data)));

  public readonly trackBy$: Subject<TrackByFunction<T>> = new BehaviorSubject<TrackByFunction<T>>(
    InfinityScrollerController.trackBy
  );

  private readonly currentFetchEvent$: BehaviorSubject<FetchEvent | null> = new BehaviorSubject<FetchEvent | null>(
    null
  );
  public readonly isLoading$: Observable<boolean> = this.currentFetchEvent$.pipe(
    map((event: FetchEvent | null) => !isNil(event))
  );

  public readonly sliceIndexesProducer: InfinityScrollerSliceIndexesProducer =
    new InfinityScrollerSliceIndexesProducer();

  constructor(config: InfinityScrollerOptions<T>) {
    this.scrollMoveDirection = config.scrollMoveDirection;
    this.bufferSize = config.bufferSize;
    this.setTrackBy(config.trackBy);
  }

  public initialize(config: InfinityScrollerPaginationConfig): void {
    if (!isNil(this.bufferSize) && config.pageSize > this.bufferSize) {
      throw new Error('[InfinityScrollerComponent] pageSize should not exceed bufferSize');
    }

    this.sliceIndexesProducer.initialize(config);
    this.data$.next([]);

    const event: FetchEvent = new InfinityScrollerEvents.GetNextPage([], {
      startIndex: config.startIndex,
      itemsCount: config.pageSize,
    });

    this.dispatchEvent(event);
  }

  public handleTopAnchorIntersect(): void {
    this.data$
      .pipe(
        take(1),
        withLatestFrom(this.isLoading$),
        filter(([_, isLoading]: [T[], boolean]) => {
          const isCorner: boolean =
            this.scrollMoveDirection === ScrollMoveDirection.FromTopToBottom
              ? this.sliceIndexesProducer.isOnTop()
              : this.sliceIndexesProducer.isOnBottom();
          return !isLoading && !isCorner;
        })
      )
      .subscribe(([data, _]: [T[], boolean]) => {
        const event: FetchEvent =
          this.scrollMoveDirection === ScrollMoveDirection.FromTopToBottom
            ? new InfinityScrollerEvents.GetPreviousPage(data, this.sliceIndexesProducer.generatePreviousPageIndexes())
            : new InfinityScrollerEvents.GetNextPage(data, this.sliceIndexesProducer.generateNextPageIndexes());

        this.dispatchEvent(event);
      });
  }

  public handleBottomAnchorIntersect(): void {
    this.data$
      .pipe(
        take(1),
        withLatestFrom(this.isLoading$),
        filter(([_, isLoading]: [T[], boolean]) => {
          const isCorner: boolean =
            this.scrollMoveDirection === ScrollMoveDirection.FromTopToBottom
              ? this.sliceIndexesProducer.isOnBottom()
              : this.sliceIndexesProducer.isOnTop();

          return !isLoading && !isCorner;
        })
      )
      .subscribe(([data, _]: [T[], boolean]) => {
        const event: FetchEvent =
          this.scrollMoveDirection === ScrollMoveDirection.FromTopToBottom
            ? new InfinityScrollerEvents.GetNextPage(data, this.sliceIndexesProducer.generateNextPageIndexes())
            : new InfinityScrollerEvents.GetPreviousPage(data, this.sliceIndexesProducer.generatePreviousPageIndexes());

        this.dispatchEvent(event);
      });
  }

  public setData(data: T[]): void {
    this.currentFetchEvent$.pipe(take(1), filterNotNil()).subscribe((event: FetchEvent | null) => {
      const isBufferOverflow: boolean =
        !isNil(this.bufferSize) &&
        this.sliceIndexesProducer.endIndex - this.sliceIndexesProducer.startIndex > this.bufferSize;

      if (!isBufferOverflow) {
        this.resetData(data);
        this.currentFetchEvent$.next(null);

        return;
      }

      const bufferOverflowSlice: number =
        this.sliceIndexesProducer.endIndex - this.sliceIndexesProducer.startIndex - this.bufferSize;

      const shouldBeCutOnTop: boolean =
        (this.scrollMoveDirection === ScrollMoveDirection.FromTopToBottom &&
          event instanceof InfinityScrollerEvents.GetNextPage) ||
        (this.scrollMoveDirection === ScrollMoveDirection.FromBottomToTop &&
          event instanceof InfinityScrollerEvents.GetPreviousPage);

      event instanceof InfinityScrollerEvents.GetNextPage
        ? this.sliceIndexesProducer.setStartIndex(this.sliceIndexesProducer.startIndex + bufferOverflowSlice)
        : this.sliceIndexesProducer.setEndIndex(this.sliceIndexesProducer.endIndex - bufferOverflowSlice);

      const updatedData: T[] = shouldBeCutOnTop ? data.slice(bufferOverflowSlice) : data.slice(0, -bufferOverflowSlice);

      this.resetData(updatedData);
      this.currentFetchEvent$.next(null);
    });
  }

  public resetData(data: T[]): void {
    this.data$.next(data);
  }

  public getEvents<E extends InfinityScrollerEvents.InfinityScrollerEventBase>(eventType: Type<E>): Observable<E> {
    return this.eventBus
      .listen()
      .pipe(
        filter((event: InfinityScrollerEvents.InfinityScrollerEventBase): event is E => event instanceof eventType)
      );
  }

  public dispatchEvent<E extends InfinityScrollerEvents.InfinityScrollerEventBase>(event: E): Observable<unknown> {
    if (
      event instanceof InfinityScrollerEvents.GetNextPage ||
      event instanceof InfinityScrollerEvents.GetPreviousPage
    ) {
      this.currentFetchEvent$.next(event);
    }

    return this.eventBus.dispatch(event);
  }

  private setTrackBy(trackBy: TrackByFunction<T> = TableDataDisplayCollection.trackBy): void {
    this.trackBy$.next(trackBy);
  }

  public static readonly trackBy: TrackByFunction<any> = <U>(index: number, dataItem: U): string => {
    if (isNil(dataItem)) {
      return `${index}__null`;
    }
    return `${index}__${JSON.stringify(dataItem)}`;
  };
}
