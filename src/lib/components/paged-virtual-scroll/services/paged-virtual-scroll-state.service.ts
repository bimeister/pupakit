import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { filterNotNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { map, distinctUntilChanged, switchMap, withLatestFrom } from 'rxjs/operators';
import { Uuid } from '../../../../internal/declarations/types/uuid.type';

@Injectable({ providedIn: 'any' })
export class PagedVirtualScrollStateService implements OnDestroy {
  public readonly viewportSize$: BehaviorSubject<ClientRect> = new BehaviorSubject<ClientRect>(null);
  public readonly viewportSquare$: Observable<number> = this.viewportSize$.pipe(
    filterNotNil(),
    map(({ height, width }: ClientRect) => width * height),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  public readonly virtualScrollItemSizesMap: Map<Uuid, ClientRect> = new Map();

  public readonly itemsTotalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly contentHeight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly scroll$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly contentTranslateY$: Observable<number> = this.scroll$.pipe(
    withLatestFrom(this.contentHeight$, this.viewportSize$.pipe(filterNotNil())),
    map(
      ([scroll, contentHeight, { height }]: [number, number, ClientRect]) =>
        -1 * scroll * ((contentHeight - height) / contentHeight) * 100
    )
  );

  public readonly wheelEvent$: BehaviorSubject<WheelEvent> = new BehaviorSubject<WheelEvent>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.subscription.add(this.processItemsTotalCountChangesForSetContentHeight());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processItemsTotalCountChangesForSetContentHeight(): Subscription {
    return this.viewportSquare$
      .pipe(
        switchMap(() => this.itemsTotalCount$),
        filterNotNil(),
        distinctUntilChanged(),
        map((itemsTotalCount: number) => {
          const visibleItemsSizes: ClientRect[] = Array.from(this.virtualScrollItemSizesMap.values());
          return PagedVirtualScrollStateService.calculateContentHeight(visibleItemsSizes, itemsTotalCount);
        })
      )
      .subscribe((contentHeight: number) => this.contentHeight$.next(contentHeight));
  }

  private static calculateContentHeight(visibleItemSizes: ClientRect[], itemsTotalCount: number): number {
    const countOfVisibleItems: number = visibleItemSizes.length;

    const totalItemsHeight: number = visibleItemSizes
      .map(({ height }: ClientRect) => height)
      .reduce((previousItemHeight: number, currentItemHeight: number) => previousItemHeight + currentItemHeight);

    return (totalItemsHeight / countOfVisibleItems) * itemsTotalCount;
  }
}
