import { AfterViewInit, EventEmitter, Injectable, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export abstract class TabsContainer<T> implements AfterViewInit, OnDestroy {
  protected abstract readonly tabsList: QueryList<T>;

  private readonly subscription: Subscription = new Subscription();

  public readonly selectedTabs$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  @Input() public isMultiSelectionEnabled: boolean = false;

  @Output() public readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() public readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  public ngAfterViewInit(): void {
    this.subscription.add(this.emitSelectedTabIndexesBySelectedTabs());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public markTabAsClicked(tab: T): void {
    const tabs: T[] = this.tabsList.toArray();
    const index: number = tabs.indexOf(tab);
    this.latestClickedTabIndex.emit(index);
  }

  public selectTabByIndex(index: number): void {
    const tabs: T[] = this.tabsList.toArray();
    this.selectTab(tabs[index]);
  }

  public selectTab(tabToSelect: T): void {
    this.selectedTabs$
      .pipe(
        take(1),
        map((selectedTabs: T[]) => {
          if (this.isMultiSelectionEnabled) {
            const tabsSet: Set<T> = new Set<T>(selectedTabs);
            tabsSet.add(tabToSelect);
            return tabsSet.values();
          }
          return [tabToSelect];
        })
      )
      .subscribe((selectedTabs: IterableIterator<T>) => {
        this.selectedTabs$.next([...selectedTabs]);
      });
  }

  public deselectTab(tabToDeselect: T): void {
    this.selectedTabs$
      .pipe(
        take(1),
        map((selectedTabs: T[]) => {
          const tabsSet: Set<T> = new Set<T>(selectedTabs);
          tabsSet.delete(tabToDeselect);
          return tabsSet.values();
        })
      )
      .subscribe((selectedTabs: IterableIterator<T>) => {
        this.selectedTabs$.next([...selectedTabs]);
      });
  }

  private emitSelectedTabIndexesBySelectedTabs(): Subscription {
    return this.selectedTabs$.subscribe((selectedTabs: T[]) => {
      const tabs: T[] = this.tabsList.toArray();
      const indexByTab: Map<T, number> = new Map<T, number>(tabs.map((tab: T, index: number) => [tab, index]));

      const selectedTabIndexes: number[] = selectedTabs.map((tab: T) => indexByTab.get(tab));
      this.selectedTabIndexes.emit(selectedTabIndexes);
    });
  }
}
