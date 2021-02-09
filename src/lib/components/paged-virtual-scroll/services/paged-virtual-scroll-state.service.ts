import { ListRange } from '@angular/cdk/collections';
import { Injectable, OnDestroy } from '@angular/core';
import { filterNotNil, filterTruthy, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';

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
  public readonly cacheSize$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly currentSliceCount$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly countItemsInViewport$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly scrolledIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly renderedRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);

  public readonly needChangeDataSource$: Subject<void> = new Subject<void>();

  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.subscription
      .add(this.calculateItemsCacheSize())
      .add(this.processScrolledIndexChanges())
      .add(this.processRenderedRangeChanges())
      .add(this.processScrollToLoadData());
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
        this.cacheSize$.next(cacheSize);
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

  private processScrollToLoadData(): Subscription {
    return combineLatest([
      this.scrolledIndex$,
      this.renderedRange$,
      this.countItemsInViewport$,
      this.currentSliceCount$
    ])
      .pipe(
        filter(
          ([scrolledIndex, renderedRange, countItemsInViewport, currentSliceCount]: [
            number,
            ListRange,
            number,
            number
          ]) =>
            !isNil(scrolledIndex) && !isNil(renderedRange) && !isNil(countItemsInViewport) && !isNil(currentSliceCount)
        ),
        map(
          ([scrolledIndex, _renderedRange, countItemsInViewport, currentSliceCount]: [
            number,
            ListRange,
            number,
            number
          ]) => {
            return scrolledIndex + countItemsInViewport >= currentSliceCount;
          }
        ),
        distinctUntilChanged(),
        filterTruthy()
      )
      .subscribe(() => this.needChangeDataSource$.next());
  }
}
