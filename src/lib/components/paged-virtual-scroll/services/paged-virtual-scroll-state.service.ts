import { ListRange } from '@angular/cdk/collections';
import { Injectable, OnDestroy } from '@angular/core';
import { distinctUntilSerializedChanged, filterNotNil, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import { VOID } from '../../../../internal/constants/void.const';
import { ListRangesIntersectionProducer } from '../../../../internal/declarations/classes/list-ranges-intersection-producer.class';
import { PagedVirtualScrollArguments } from '../../../../internal/declarations/interfaces/paged-virtual-scroll-arguments.interface';
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/types/virtual-scroll-viewport-component.type';

const REACT_ON_RANGE_CHANGES_DELAY_MS: number = 500;

@Injectable({ providedIn: 'any' })
export class PagedVirtualScrollStateService implements OnDestroy {
  public readonly viewport$: BehaviorSubject<VirtualScrollViewportComponent> =
    new BehaviorSubject<VirtualScrollViewportComponent>(null);

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
  public readonly firstSliceCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly scrolledIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly renderedRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);

  public readonly pagedVirtualScrollArgumentsToOutput$: Subject<PagedVirtualScrollArguments> =
    new Subject<PagedVirtualScrollArguments>();

  private readonly previousRangeInPagedVirtualArguments$: Observable<ListRange> =
    this.pagedVirtualScrollArgumentsToOutput$.pipe(
      startWith(VOID),
      map((pagedVirtualScrollArguments: PagedVirtualScrollArguments) => ({
        start: pagedVirtualScrollArguments?.currentFrom,
        end: pagedVirtualScrollArguments?.currentTo
      }))
    );

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
      .add(this.processRangeChanges())
      .add(this.processCalculateFirstSliceCount());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setViewportComponent(viewport: VirtualScrollViewportComponent): void {
    this.viewport$.next(viewport);
  }

  public scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    const serializedScrollIndex: number = index ?? 0;
    this.viewport$
      .pipe(filterNotNil(), take(1))
      .subscribe((viewport: VirtualScrollViewportComponent) => viewport.scrollToIndex(serializedScrollIndex, behavior));
  }

  public refreshWithScrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    this.renderedRange$.next(null);
    combineLatest([this.viewport$.pipe(filterNotNil()), this.firstSliceCount$.pipe(filterNotNil())])
      .pipe(filterNotNil(), take(1), withLatestFrom(this.totalCount$))
      .subscribe(([[viewport, firstSliceCount], totalCount]: [[VirtualScrollViewportComponent, number], number]) => {
        const serializedScrollIndex: number = index ?? 0;
        viewport.scrollToIndex(serializedScrollIndex, behavior);

        const serializedEnd: number = Math.min(serializedScrollIndex + firstSliceCount, totalCount);
        const serializedStart: number = Math.max(serializedEnd - firstSliceCount, 0);

        const roundedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
          { start: serializedStart, end: serializedEnd },
          firstSliceCount,
          totalCount
        );

        const pagedVirtualScrollArguments: PagedVirtualScrollArguments =
          ListRangesIntersectionProducer.getPagedVirtualScrollArguments(null, roundedRange);
        this.pagedVirtualScrollArgumentsToOutput$.next(pagedVirtualScrollArguments);
      });
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
    return this.renderedRange$
      .pipe(
        filterNotNil(),
        withLatestFrom(this.countItemsInViewport$, this.totalCount$),
        map(([range, countItemsInViewport, totalCount]: [ListRange, number, number]) =>
          ListRangesIntersectionProducer.roundToBoundingDozensByCount(range, countItemsInViewport, totalCount)
        ),
        distinctUntilSerializedChanged(),
        filterNotNil(),
        debounceTime(REACT_ON_RANGE_CHANGES_DELAY_MS),
        withLatestFrom(this.previousRangeInPagedVirtualArguments$),
        map(([currentRange, previousRange]: [ListRange, ListRange]) =>
          ListRangesIntersectionProducer.getPagedVirtualScrollArguments(previousRange, currentRange)
        ),
        distinctUntilSerializedChanged()
      )
      .subscribe((pagedVirtualScrollArguments: PagedVirtualScrollArguments) => {
        this.pagedVirtualScrollArgumentsToOutput$.next(pagedVirtualScrollArguments);
      });
  }

  private processCalculateFirstSliceCount(): Subscription {
    return this.countItemsInViewport$
      .pipe(
        filterNotNil(),
        distinctUntilChanged(),
        map((countItemsInViewport: number) => {
          const range: ListRange = { start: 0, end: countItemsInViewport };
          return ListRangesIntersectionProducer.roundToBoundingDozensByCount(range, countItemsInViewport, undefined);
        }),
        filterNotNil()
      )
      .subscribe((roundedRange: ListRange) => this.firstSliceCount$.next(roundedRange.end));
  }
}
