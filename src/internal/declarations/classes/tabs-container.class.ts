import { AfterViewInit, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

export abstract class TabsContainer implements AfterViewInit, OnDestroy {
  protected abstract readonly tabsList: QueryList<unknown>;

  private readonly subscription: Subscription = new Subscription();

  public readonly selectedTabs$: BehaviorSubject<unknown[]> = new BehaviorSubject<unknown[]>([]);

  @Input() public isMultiSelectionEnabled: boolean = false;

  @Output() public readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() public readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  public ngAfterViewInit(): void {
    this.subscription.add(this.emitSelectedTabIndexesBySelectedTabs());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public markTabAsClicked(tab: unknown): void {
    const tabs: unknown[] = this.tabsList.toArray();
    const index: number = tabs.indexOf(tab);
    this.latestClickedTabIndex.emit(index);
  }

  public selectTabByIndex(index: number): void {
    const tabs: unknown[] = this.tabsList.toArray();
    this.selectTab(tabs[index]);
  }

  public selectTab(tabToSelect: unknown): void {
    this.selectedTabs$
      .pipe(
        take(1),
        map((selectedTabs: unknown[]) => {
          if (this.isMultiSelectionEnabled) {
            const tabsSet: Set<unknown> = new Set<unknown>(selectedTabs);
            tabsSet.add(tabToSelect);
            return tabsSet.values();
          }
          return [tabToSelect];
        })
      )
      .subscribe((selectedTabs: IterableIterator<unknown>) => this.selectedTabs$.next([...selectedTabs]));
  }

  public deselectTab(tabToDeselect: unknown): void {
    this.selectedTabs$
      .pipe(
        take(1),
        map((selectedTabs: unknown[]) => {
          const tabsSet: Set<unknown> = new Set<unknown>(selectedTabs);
          tabsSet.delete(tabToDeselect);
          return tabsSet.values();
        })
      )
      .subscribe((selectedTabs: IterableIterator<unknown>) => this.selectedTabs$.next([...selectedTabs]));
  }

  private emitSelectedTabIndexesBySelectedTabs(): Subscription {
    return this.selectedTabs$.subscribe((selectedTabs: unknown[]) => {
      const tabs: unknown[] = this.tabsList.toArray();
      const indexByTab: Map<unknown, number> = new Map<unknown, number>(
        tabs.map((tab: unknown, index: number) => [tab, index])
      );

      const selectedTabIndexes: number[] = selectedTabs.map((tab: unknown) => indexByTab.get(tab));
      this.selectedTabIndexes.emit(selectedTabIndexes);
    });
  }
}
