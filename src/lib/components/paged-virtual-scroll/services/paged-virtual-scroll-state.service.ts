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
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';

const REACT_ON_RANGE_CHANGES_DELAY_MS: number = 500;

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

  private readonly previousRangeInPagedVirtualArguments$: Observable<ListRange> = this.needChangeDataSource$.pipe(
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
        this.needChangeDataSource$.next(pagedVirtualScrollArguments);
      });
  }
}
