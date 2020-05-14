import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subscription, timer } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pluck,
  shareReplay,
  startWith,
  switchMap,
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

export abstract class TabsContainer<T extends TabsContainerItem>
  implements OnInit, AfterContentInit, AfterContentChecked, OnDestroy {
  protected abstract readonly tabsList: QueryList<T>;
  @Input() public isAutoSelectionEnabled: boolean = false;
  @Input() public isMultiSelectionEnabled: boolean = false;

  private readonly subscription: Subscription = new Subscription();

  @Output() public readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() public readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  private readonly tabs$: ReplaySubject<T[]> = new ReplaySubject<T[]>(0);

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
      return combineLatest(
        tabs.map((tab: T, tabIndex: number) => {
          return tab.isSelected$.pipe(
            map((isSelected: boolean) => {
              return { tabIndex, isSelected };
            })
          );
        })
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

    filter((indexes: number[]) => Array.isArray(indexes) && !Object.is(indexes.length, 0)),
    shareReplay(1)
  );

  private readonly selectedTabs$: Observable<T[]> = this.selectedTabsIndexes$.pipe(
    startWith([]),
    withLatestFrom(this.tabs$),
    map(([indexes, tabs]: [number[], T[]]) => indexes.map((index: number) => tabs[index]))
  );

  private readonly someTabWasSelected$: Observable<boolean> = this.selectedTabsIndexes$.pipe(
    mapTo(true),
    startWith(false),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(protected readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.subscription
      .add(this.toggleTabSelectionOnClick())
      .add(this.emitEventOnSelectedTabsIndexesUpdate())
      .add(this.detectChangesOnTabsSelection());
  }

  public ngAfterContentInit(): void {
    this.subscription.add(this.updateTabsOnTabsListChanges()).add(this.selectFirstTabIfNoneIsSelected());
  }

  public ngAfterContentChecked(): void {
    this.tabsList.notifyOnChanges();
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
      .subscribe((targetTab: T) => targetTab.processTabClick());
  }

  private triggerChangeDetection(): void {
    this.changeDetectorRef.markForCheck();
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

  private updateTabsOnTabsListChanges(): Subscription {
    return this.tabsList.changes
      .pipe(
        distinctUntilChanged(
          (previousValue: QueryList<T>, currentValue: QueryList<T>) =>
            previousValue?.toString() === currentValue?.toString()
        )
      )
      .subscribe((tabsList: QueryList<T>) => {
        const tabs: T[] = tabsList.toArray();
        this.tabs$.next(tabs);
        this.triggerChangeDetection();
      });
  }

  private selectFirstTabIfNoneIsSelected(): Subscription {
    return this.tabsList.changes
      .pipe(
        distinctUntilChanged(
          (previousValue: QueryList<T>, currentValue: QueryList<T>) =>
            previousValue?.toString() === currentValue?.toString()
        ),
        map((queryList: QueryList<T>) => queryList?.toArray()),
        filter((tabs: T[]) => Array.isArray(tabs)),
        take(1),
        filter(() => this.isAutoSelectionEnabled),
        pluck(0),
        withLatestFrom(this.someTabWasSelected$)
      )
      .subscribe(([tab, someTabWasSelected]: [T, boolean]) => {
        if (someTabWasSelected) {
          return;
        }
        tab.select();
      });
  }

  private emitEventOnSelectedTabsIndexesUpdate(): Subscription {
    return this.selectedTabsIndexes$.subscribe((indexes: number[]) => this.selectedTabIndexes.emit(indexes));
  }

  private detectChangesOnTabsSelection(): Subscription {
    return this.selectedTabsIndexes$
      .pipe(
        switchMap(() => {
          return timer().pipe(take(1));
        })
      )
      .subscribe(() => {
        this.triggerChangeDetection();
      });
  }
}
