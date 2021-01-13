import { AfterViewInit, EventEmitter, Injectable, OnDestroy, QueryList } from '@angular/core';
import { isNil } from '@bimeister/utilities/common';
import { merge, ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { Uuid } from '../../types/uuid.type';
import { TabsContainerItem } from './tabs-container-item.abstract';

@Injectable()
export abstract class TabsContainer implements AfterViewInit, OnDestroy {
  protected abstract isMultiSelectionEnabled: boolean;

  protected abstract readonly selectedTabIndexes: EventEmitter<number[]>;
  protected abstract readonly latestClickedTabIndex: EventEmitter<number>;

  protected abstract readonly tabsList: QueryList<TabsContainerItem>;
  private readonly tabsList$: ReplaySubject<TabsContainerItem[]> = new ReplaySubject<TabsContainerItem[]>(1);

  private readonly subscription: Subscription = new Subscription();

  public readonly selectedTabsIds$: ReplaySubject<Uuid[]> = new ReplaySubject<Uuid[]>(1);

  public ngAfterViewInit(): void {
    this.subscription
      .add(this.processSelectedTabsUpdate())
      .add(this.updateTabsListOnContentChanges())
      .add(this.processTabClick())
      .add(this.processTabDeselection())
      .add(this.processTabSelection());

    this.tabsList.notifyOnChanges();

    this.processInitialTabsState();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public markTabAsClicked(tab: TabsContainerItem): void {
    const tabs: TabsContainerItem[] = this.tabsList.toArray();
    const index: number = tabs.indexOf(tab);
    this.latestClickedTabIndex.emit(index);
  }

  public selectTabByIndex(index: number): void {
    const tabs: TabsContainerItem[] = this.tabsList.toArray();
    const tabToSelect: TabsContainerItem = tabs[index];
    this.selectTab(tabToSelect);
  }

  public selectTab(tabToSelect: TabsContainerItem): void {
    if (isNil(tabToSelect)) {
      return;
    }

    this.selectTabById(tabToSelect.id);
  }

  public deselectTab(tabToDeselect: TabsContainerItem): void {
    if (isNil(tabToDeselect)) {
      return;
    }

    this.deselectTabById(tabToDeselect.id);
  }

  private processInitialTabsState(): void {
    const initiallyActiveTabsIds: Uuid[] = this.tabsList
      .toArray()
      .filter((tab: TabsContainerItem) => tab.isActive)
      .map((tab: TabsContainerItem) => tab.id);
    this.selectedTabsIds$.next(initiallyActiveTabsIds);
  }

  private markTabAsClickedById(tabId: Uuid): void {
    const tabs: TabsContainerItem[] = this.tabsList.toArray();
    const targetTab: TabsContainerItem = tabs.find((tab: TabsContainerItem) => tab.id === tabId);
    this.markTabAsClicked(targetTab);
  }

  private selectTabById(tabId: Uuid): void {
    this.selectedTabsIds$
      .pipe(
        take(1),
        map((selectedTabsIds: Uuid[]) => {
          if (this.isMultiSelectionEnabled) {
            const selectedTabsIdsSet: Set<Uuid> = new Set<Uuid>(selectedTabsIds);
            selectedTabsIdsSet.add(tabId);
            return selectedTabsIdsSet.values();
          }
          return [tabId];
        })
      )
      .subscribe((selectedTabsIds: IterableIterator<Uuid>) => {
        this.selectedTabsIds$.next([...selectedTabsIds]);
      });
  }

  private deselectTabById(tabId: Uuid): void {
    this.selectedTabsIds$
      .pipe(
        take(1),
        map((selectedTabsIds: Uuid[]) => {
          const selectedTabsIdsSet: Set<Uuid> = new Set<Uuid>(selectedTabsIds);
          selectedTabsIdsSet.delete(tabId);
          return selectedTabsIdsSet.values();
        })
      )
      .subscribe((selectedTabsIds: IterableIterator<Uuid>) => {
        this.selectedTabsIds$.next([...selectedTabsIds]);
      });
  }

  private processSelectedTabsUpdate(): Subscription {
    return this.selectedTabsIds$
      .pipe(
        withLatestFrom(this.tabsList$),
        map(([selectedTabsIds, allTabs]: [Uuid[], TabsContainerItem[]]) => {
          const selectedTabsIdsSet: Set<Uuid> = new Set<Uuid>(selectedTabsIds);
          const deselectedTabsIds: Uuid[] = allTabs
            .filter((tab: TabsContainerItem) => !selectedTabsIdsSet.has(tab.id))
            .map((tab: TabsContainerItem) => tab.id);
          const tabIndexByTabId: Map<Uuid, number> = new Map<Uuid, number>(
            allTabs.map((tab: TabsContainerItem, index: number) => [tab.id, index])
          );
          const tabByTabId: Map<Uuid, TabsContainerItem> = new Map<Uuid, TabsContainerItem>(
            allTabs.map((tab: TabsContainerItem) => [tab.id, tab])
          );

          return [selectedTabsIds, deselectedTabsIds, tabIndexByTabId, tabByTabId];
        })
      )
      .subscribe(
        ([selectedTabsIds, deselectedTabsIds, tabIndexByTabId, tabByTabId]: [
          Uuid[],
          Uuid[],
          Map<Uuid, number>,
          Map<Uuid, TabsContainerItem>
        ]) => {
          this.updateTabsSelection(selectedTabsIds, tabByTabId, deselectedTabsIds);

          const selectedTabIndexes: number[] = selectedTabsIds.map((tabId: Uuid) => tabIndexByTabId.get(tabId));
          this.selectedTabIndexes.emit(selectedTabIndexes);
        }
      );
  }

  private updateTabsSelection(
    selectedTabsIds: string[],
    tabByTabId: Map<string, TabsContainerItem>,
    deselectedTabsIds: string[]
  ): void {
    selectedTabsIds
      .map((tabId: Uuid) => tabByTabId.get(tabId))
      .forEach((tab: TabsContainerItem) => {
        tab.isSelected = true;
        tab.triggerChangeDetector();
      });

    deselectedTabsIds
      .map((tabId: Uuid) => tabByTabId.get(tabId))
      .forEach((tab: TabsContainerItem) => {
        tab.isSelected = false;
        tab.triggerChangeDetector();
      });
  }

  private updateTabsListOnContentChanges(): Subscription {
    return this.tabsList.changes
      .pipe(
        map(() => this.tabsList.toString()),
        distinctUntilChanged(),
        map(() => this.tabsList.toArray())
      )
      .subscribe((tabs: TabsContainerItem[]) => this.tabsList$.next(tabs));
  }

  private processTabSelection(): Subscription {
    return this.tabsList$
      .pipe(
        switchMap((tabs: TabsContainerItem[]) => {
          return merge(...tabs.map((tab: TabsContainerItem) => tab.onSelect$));
        })
      )
      .subscribe((tabId: Uuid) => this.selectTabById(tabId));
  }

  private processTabDeselection(): Subscription {
    return this.tabsList$
      .pipe(
        switchMap((tabs: TabsContainerItem[]) => {
          return merge(...tabs.map((tab: TabsContainerItem) => tab.onDeselect$));
        })
      )
      .subscribe((tabId: Uuid) => this.deselectTabById(tabId));
  }

  private processTabClick(): Subscription {
    return this.tabsList$
      .pipe(
        switchMap((tabs: TabsContainerItem[]) => {
          return merge(...tabs.map((tab: TabsContainerItem) => tab.onClick$));
        })
      )
      .subscribe((tabId: Uuid) => this.markTabAsClickedById(tabId));
  }
}
