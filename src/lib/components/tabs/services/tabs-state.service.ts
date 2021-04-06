import { Injectable } from '@angular/core';
import { distinctUntilSerializedChanged, filterNotNil, filterTruthy } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { TabsStateProducerService } from '../../../../internal/declarations/classes/abstract/tabs-state-producer-service.abstract';

@Injectable()
export class TabsStateService extends TabsStateProducerService {
  public readonly activeTabWidthPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly activeTabOffsetX$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly activeTabTranslateX$: Observable<string> = this.activeTabOffsetX$.pipe(
    distinctUntilChanged(),
    map((activeTabOffsetX: number) => `translateX(${activeTabOffsetX}px)`)
  );

  private readonly tabsItemsByValueClientRectMap: Map<unknown, ClientRect> = new Map<unknown, ClientRect>();

  constructor() {
    super();

    this.subscription.add(this.processActiveTabChanges());
  }

  public setTabItemClientRectInMap(value: unknown, clientRect: ClientRect): void {
    this.tabsItemsByValueClientRectMap.set(value, clientRect);
  }

  private processActiveTabChanges(): Subscription {
    return this.isViewInit$
      .pipe(
        debounceTime(0),
        filterTruthy(),
        take(1),
        switchMap(() => this.activeTabValueSet$),
        map((activeTabValueSet: Set<unknown>) => Array.from(activeTabValueSet.values())),
        distinctUntilSerializedChanged(),
        map(([value]: unknown[]) => value),
        filterNotNil(),
        map((value: unknown) => this.tabsItemsByValueClientRectMap.get(value)),
        filterNotNil()
      )
      .subscribe(({ width, left }: ClientRect) => {
        this.activeTabWidthPx$.next(width);
        this.activeTabOffsetX$.next(left);
      });
  }
}
