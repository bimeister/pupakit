import { ListRange } from '@angular/cdk/collections';
import { Injectable, OnDestroy } from '@angular/core';
import {
  distinctUntilSerializedChanged,
  filterNotNil,
  isNil,
  Nullable,
  shareReplayWithRefCount
} from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import { VOID } from '../../../../internal/constants/void.const';
import { PagedVirtualScrollArgumentsDto } from '../../../../internal/declarations/classes/dto/paged-virtual-scroll-arguments.dto';
import { PagedVirtualScrollArguments } from '../../../../internal/declarations/interfaces/paged-virtual-scroll-arguments.interface';
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';

function findIntersectionOfRanges(firstInterval: ListRange, secondInterval: ListRange): ListRange | undefined {
  if (isNil(firstInterval) || isNil(secondInterval)) {
    return undefined;
  }

  const { start: firstIntervalStart, end: firstIntervalEnd }: ListRange = firstInterval;
  const { start: secondIntervalStart, end: secondIntervalEnd }: ListRange = secondInterval;

  const isNilValuesEntering: boolean =
    isNil(firstIntervalStart) || isNil(firstIntervalEnd) || isNil(secondIntervalStart) || isNil(secondIntervalEnd);
  if (isNilValuesEntering) {
    return undefined;
  }

  const hasIntersection: boolean = firstIntervalStart <= secondIntervalEnd && secondIntervalStart <= firstIntervalEnd;
  if (!hasIntersection) {
    return undefined;
  }

  const intersectionStart: number = Math.max(firstIntervalStart, secondIntervalStart);
  const intersectionEnd: number = Math.min(firstIntervalEnd, secondIntervalEnd);

  return { start: intersectionStart, end: intersectionEnd };
}

@Injectable({ providedIn: 'any' })
export class PagedVirtualScrollStateService implements OnDestroy {
  public readonly viewport$: BehaviorSubject<VirtualScrollViewportComponent> = new BehaviorSubject<VirtualScrollViewportComponent>(
    null
  );

  public readonly viewportSize$: BehaviorSubject<ClientRect> = new BehaviorSubject<ClientRect>(null);
  public readonly viewportSquare$: Observable<number> = this.viewportSize$.pipe(
    filterNotNil(),
    map(({ height, width }: ClientRect) => width * height),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  public readonly itemSize$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly calculatedCacheSize$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly countItemsInViewport$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly scrolledIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly renderedRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);

  public readonly needChangeDataSource$: Subject<PagedVirtualScrollArguments> = new Subject<PagedVirtualScrollArguments>();

  public readonly totalContentSize$: Observable<number> = combineLatest([this.itemSize$, this.totalCount$]).pipe(
    filter(([itemSize, totalCount]: [number, number]) => !isNil(itemSize) && !isNil(totalCount)),
    map(([itemSize, totalCount]: [number, number]) => itemSize * totalCount),
    delayWhen(() => this.viewport$.pipe(filterNotNil(), take(1))),
    debounceTime(0),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.subscription
      .add(this.calculateItemsCacheSize())
      .add(this.processScrolledIndexChanges())
      .add(this.processRenderedRangeChanges())
      .add(this.processRangeChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setViewportComponent(viewport: VirtualScrollViewportComponent): void {
    this.viewport$.next(viewport);
  }

  private calculateItemsCacheSize(): Subscription {
    return this.viewportSquare$
      .pipe(
        switchMap(() => combineLatest([this.viewportSize$, this.itemSize$])),
        filter(([viewportSize, itemSize]: [ClientRect, number]) => !isNil(viewportSize) && !isNil(itemSize)),
        map(([{ height }, itemSize]: [ClientRect, number]) => {
          const countItemsInViewport: number = Math.ceil(height / itemSize);
          return [countItemsInViewport, countItemsInViewport * 3];
        })
      )
      .subscribe(([countItemsInViewport, cacheSize]: [number, number]) => {
        this.calculatedCacheSize$.next(cacheSize);
        this.countItemsInViewport$.next(countItemsInViewport);
      });
  }

  private processScrolledIndexChanges(): Subscription {
    return this.viewport$
      .pipe(
        filterNotNil(),
        switchMap((viewport: VirtualScrollViewportComponent) => viewport.scrolledIndexChange)
      )
      .subscribe((scrolledIndex: number) => this.scrolledIndex$.next(scrolledIndex));
  }

  private processRenderedRangeChanges(): Subscription {
    return this.viewport$
      .pipe(
        filterNotNil(),
        switchMap((viewport: VirtualScrollViewportComponent) => viewport.renderedRangeStream)
      )
      .subscribe((renderedRange: ListRange) => this.renderedRange$.next(renderedRange));
  }

  private processRangeChanges(): Subscription {
    return combineLatest([
      this.countItemsInViewport$.pipe(filterNotNil(), take(1)),
      this.totalCount$.pipe(filterNotNil(), take(1))
    ])
      .pipe(
        switchMap(() => this.renderedRange$),
        filterNotNil(),
        withLatestFrom(this.countItemsInViewport$, this.totalCount$),
        map(([range, countItemsInViewport, totalCount]: [ListRange, number, number]) => {
          // test
          const { start, end }: ListRange = range;

          const countOfDigits: number = String(countItemsInViewport).length - 1;
          const roundValue: number = Math.max(countOfDigits * 10, 0);

          const possibleStart: number = start - countItemsInViewport;
          const currentFrom: number = Math.max(Math.round(possibleStart / roundValue) * roundValue, 0);

          const possibleEnd: number = end + countItemsInViewport;
          const currentTo: number = Math.min(Math.round(possibleEnd / roundValue) * roundValue, totalCount);

          return { start: currentFrom, end: currentTo };
        }),
        distinctUntilSerializedChanged(),
        startWith(VOID),
        pairwise(),
        distinctUntilSerializedChanged(),
        map(([previousRange, currentRange]: [ListRange, ListRange]) => {
          // test
          const serializedCurrentRangeStart: Nullable<number> = currentRange?.start ?? null;
          const serializedCurrentRangeEnd: Nullable<number> = currentRange?.end ?? null;

          const serializedPreviousRangeStart: Nullable<number> = previousRange?.start ?? null;
          const serializedPreviousRangeEnd: Nullable<number> = previousRange?.end ?? null;

          const intersectionRange: ListRange = findIntersectionOfRanges(previousRange, currentRange);

          if (isNil(intersectionRange)) {
            return new PagedVirtualScrollArgumentsDto({
              currentFrom: serializedCurrentRangeStart,
              currentTo: serializedCurrentRangeEnd,

              previousFrom: serializedPreviousRangeStart,
              previousTo: serializedPreviousRangeEnd,

              removeFrom: serializedPreviousRangeStart,
              removeTo: serializedPreviousRangeEnd,

              getFrom: serializedCurrentRangeStart,
              getTo: serializedCurrentRangeEnd
            });
          }

          const isScrollingDownIntersection: boolean =
            serializedCurrentRangeStart >= intersectionRange.start &&
            serializedCurrentRangeStart <= intersectionRange.end;
          if (isScrollingDownIntersection) {
            const downPossibleRemoveFrom: number =
              serializedPreviousRangeStart === intersectionRange.start ? null : serializedPreviousRangeStart;
            const downPossibleRemoveTo: number = isNil(downPossibleRemoveFrom) ? null : intersectionRange.start;

            return new PagedVirtualScrollArgumentsDto({
              currentFrom: serializedCurrentRangeStart,
              currentTo: serializedCurrentRangeEnd,

              previousFrom: serializedPreviousRangeStart,
              previousTo: serializedPreviousRangeEnd,

              removeFrom: downPossibleRemoveFrom,
              removeTo: downPossibleRemoveTo,

              getFrom: intersectionRange.end,
              getTo: serializedCurrentRangeEnd
            });
          }

          return new PagedVirtualScrollArgumentsDto({
            currentFrom: serializedCurrentRangeStart,
            currentTo: serializedCurrentRangeEnd,

            previousFrom: serializedPreviousRangeStart,
            previousTo: serializedPreviousRangeEnd,

            removeFrom: serializedCurrentRangeEnd,
            removeTo: serializedPreviousRangeEnd,

            getFrom: serializedCurrentRangeStart,
            getTo: intersectionRange.start
          });
        }),
        distinctUntilSerializedChanged()
      )
      .subscribe((pagedVirtualScrollArguments: PagedVirtualScrollArguments) => {
        this.needChangeDataSource$.next(pagedVirtualScrollArguments);
      });
  }
}
