import { AfterContentChecked, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { BehaviorSubject, forkJoin, merge, Observable, of, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  switchMapTo,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { TabsContainerItem } from './tabs-container-item.class';

interface TabMarker {
  tabIndex: number;
  isSelected: boolean;
}

export abstract class TabsContainer<T extends TabsContainerItem> implements AfterContentChecked, OnDestroy {
  @Input() public isAutoSelectionDisabled: boolean = false;
  @Input() public isMultiSelectionEnabled: boolean = false;

  protected abstract readonly tabsList: QueryList<T>;

  @Output() public readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() public readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  private readonly subscription: Subscription = new Subscription();

  private readonly tabs$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  private readonly lastClickedTab$: Observable<T> = this.tabs$.pipe(
    switchMap((tabs: T[]) => {
      return merge(
        ...tabs.map((tab: T, tabIndex: number) =>
          tab.clicked$.pipe(tap(() => this.latestClickedTabIndex.emit(tabIndex)))
        )
      );
    }),
    shareReplay(1)
  );

  private readonly selectedTabsIndexes$: Observable<number[]> = this.tabs$.pipe(
    switchMap((tabs: T[]) => {
      return forkJoin(
        tabs.map((tab: T, tabIndex: number) =>
          tab.isSelected$.pipe(
            take(1),
            map((isSelected: boolean) => ({ tabIndex, isSelected }))
          )
        )
      );
    }),
    map((tabsMarkers: TabMarker[]) =>
      tabsMarkers
        .filter((marker: TabMarker) => {
          return marker.isSelected;
        })
        .map((marker: TabMarker) => {
          return marker.tabIndex;
        })
    ),
    filter((indexes: number[]) => Array.isArray(indexes) && !Object.is(indexes.length, 0))
  );

  private readonly selectedTabs$: Observable<T[]> = this.selectedTabsIndexes$.pipe(
    startWith([]),
    withLatestFrom(this.tabs$),
    map(([indexes, tabs]: [number[], T[]]) => indexes.map((index: number) => tabs[index]))
  );

  private readonly someTabWasSelected$: Observable<boolean> = merge(
    of(false),
    this.selectedTabsIndexes$.pipe(mapTo(true))
  ).pipe(distinctUntilChanged(), shareReplay(1));

  constructor() {
    this.subscription.add(this.toggleTabSelectionOnClick()).add(this.emitEventOnSelectedTabsIndexesUpdate());
  }

  public ngAfterContentChecked(): void {
    this.updateTabsClickTriggers();
    this.selectFirstIfNoneIsSelected();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public selectTabByIndex(tabIndex: number): void {
    this.tabs$
      .pipe(
        take(1),
        filter((tabs: T[]) => Array.isArray(tabs)),
        pluck(tabIndex),
        filter((targetTab: T) => !isNullOrUndefined(targetTab))
      )
      .subscribe((targetTab: T) => targetTab.select());
  }

  private updateTabsClickTriggers(): void {
    const tabs: T[] = this.tabsList.toArray();
    this.tabs$.next(tabs);
  }

  private selectFirstIfNoneIsSelected(): void {
    this.someTabWasSelected$
      .pipe(
        take(1),
        filter(() => !this.isAutoSelectionDisabled),
        filter((wasSelected: boolean) => !wasSelected),
        switchMapTo(this.tabs$.pipe(take(1))),
        map((tabs: T[]) => tabs.filter((tab: T) => !tab.isAutoSelectionDisabled)),
        pluck(0),
        filter((targetTab: T) => !isNullOrUndefined(targetTab))
      )
      .subscribe((targetTab: T) => {
        targetTab.select();
      });
  }

  private toggleTabSelectionOnClick(): Subscription {
    return this.lastClickedTab$
      .pipe(
        filter((clickedTab: T) => !isNullOrUndefined(clickedTab)),
        tap((clickedTab: T) => (this.isMultiSelectionEnabled ? clickedTab.toggleSelection() : clickedTab.select())),
        withLatestFrom(this.selectedTabs$),
        map(([clickedTab, selectedTabs]: [T, T[]]) => {
          if (this.isMultiSelectionEnabled) {
            return [];
          }
          return selectedTabs.filter((tab: T) => tab.id !== clickedTab.id);
        })
      )
      .subscribe((tabsToDeselect: T[]) => {
        tabsToDeselect.forEach((tab: T) => tab.deselect());
      });
  }

  private emitEventOnSelectedTabsIndexesUpdate(): Subscription {
    return this.selectedTabsIndexes$.subscribe((indexes: number[]) => this.selectedTabIndexes.emit(indexes));
  }
}
