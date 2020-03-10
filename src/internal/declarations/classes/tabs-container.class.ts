import { AfterContentChecked, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { BehaviorSubject, merge, Observable, of, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { Uuid } from '../types/uuid.type';
import { TabsContainerItem } from './tabs-container-item.class';

export abstract class TabsContainer<T extends TabsContainerItem> implements AfterContentChecked, OnDestroy {
  @Input() public isAutoSelectionDisabled: boolean = false;
  @Input() public isMultiSelectionEnabled: boolean = false;

  protected abstract readonly tabsList: QueryList<T>;

  @Output() public readonly selectedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  private readonly subscription: Subscription = new Subscription();

  private readonly tabs$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private readonly lastClickedTab$: Observable<T> = this.tabs$.pipe(
    switchMap((tabs: T[]) => {
      const tabsTriggers$: Observable<T>[] = tabs.map((tab: T) => tab.clicked$);
      return merge(...tabsTriggers$);
    }),
    shareReplay(1)
  );

  private readonly someTabWasSelected$: Observable<boolean> = merge(
    of(false),
    this.lastClickedTab$.pipe(mapTo(true))
  ).pipe(distinctUntilChanged(), shareReplay(1));

  constructor() {
    this.updateItemSelectionOnClick();
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
      .subscribe((targetTab: T) => this.selectTab(targetTab));
  }

  public deselectTabByIndex(tabIndex: number): void {
    this.tabs$
      .pipe(
        take(1),
        filter((tabs: T[]) => Array.isArray(tabs)),
        pluck(tabIndex),
        filter((targetTab: T) => !isNullOrUndefined(targetTab))
      )
      .subscribe((targetTab: T) => targetTab.deselect());
  }

  public deselectAllTabs(): void {
    this.tabs$
      .pipe(
        take(1),
        filter((tabs: T[]) => Array.isArray(tabs))
      )
      .subscribe((tabs: T[]) => tabs.forEach((tab: T) => tab.deselect()));
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
        filter((wasSelected: boolean) => !wasSelected)
      )
      .subscribe(() => this.selectTabByIndex(0));
  }

  private updateItemSelectionOnClick(): Subscription {
    return this.lastClickedTab$
      .pipe(
        filter((clickedTab: T) => !isNullOrUndefined(clickedTab)),
        tap((clickedTab: T) => this.selectTab(clickedTab)),
        withLatestFrom(this.tabs$),
        map(([clickedTab, tabs]: [T, T[]]) => {
          if (this.isMultiSelectionEnabled) {
            return [];
          }
          return tabs.filter((tab: T) => tab.id !== clickedTab.id);
        })
      )
      .subscribe((tabsToDeselect: T[]) => {
        tabsToDeselect.forEach((tab: T) => tab.deselect());
      });
  }

  private selectTab(tab: T): void {
    tab.select();
    this.emitSelectedTabIndex(tab.id);
  }

  private emitSelectedTabIndex(tabId: Uuid): void {
    this.tabs$
      .pipe(
        take(1),
        map((tabs: T[]) => tabs.map((tab: T) => tab.id)),
        map((tabIds: Uuid[]) => tabIds.indexOf(tabId))
      )
      .subscribe((index: number) => this.selectedTabIndex.emit(index));
  }
}
