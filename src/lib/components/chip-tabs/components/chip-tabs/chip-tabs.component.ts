import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';
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

import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { ChipTabsItemComponent } from '../chip-tabs-item/chip-tabs-item.component';

@Component({
  selector: 'pupa-chip-tabs',
  templateUrl: './chip-tabs.component.html',
  styleUrls: ['./chip-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsComponent implements AfterContentChecked, OnDestroy {
  @Input() public isAutoSelectionDisabled: boolean = false;

  @ContentChildren(ChipTabsItemComponent) private readonly tabsList: QueryList<ChipTabsItemComponent>;

  @Output() public readonly selectedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  private readonly subscription: Subscription = new Subscription();

  private readonly tabs$: BehaviorSubject<ChipTabsItemComponent[]> = new BehaviorSubject<ChipTabsItemComponent[]>([]);
  private readonly clickedTab$: Observable<ChipTabsItemComponent> = this.tabs$.pipe(
    switchMap((tabs: ChipTabsItemComponent[]) => {
      const tabsTriggers$: Observable<ChipTabsItemComponent>[] = tabs.map((tab: ChipTabsItemComponent) => tab.clicked$);
      return merge(...tabsTriggers$);
    }),
    shareReplay(1)
  );

  private readonly tabIsClicked$: Observable<boolean> = merge(of(false), this.clickedTab$.pipe(mapTo(true))).pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

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
        filter((tabs: ChipTabsItemComponent[]) => Array.isArray(tabs)),
        pluck(tabIndex),
        filter((targetTab: ChipTabsItemComponent) => !isNullOrUndefined(targetTab))
      )
      .subscribe((firstTab: ChipTabsItemComponent) => this.selectTab(firstTab));
  }

  private updateTabsClickTriggers(): void {
    const tabs: ChipTabsItemComponent[] = this.tabsList.toArray();
    this.tabs$.next(tabs);
  }

  private selectFirstIfNoneIsSelected(): void {
    this.tabIsClicked$
      .pipe(
        filter(() => !this.isAutoSelectionDisabled),
        take(1),
        filter((isClicked: boolean) => !isClicked)
      )
      .subscribe(() => this.selectTabByIndex(0));
  }

  private updateItemSelectionOnClick(): Subscription {
    return this.clickedTab$
      .pipe(
        filter((clickedTab: ChipTabsItemComponent) => !isNullOrUndefined(clickedTab)),
        tap((clickedTab: ChipTabsItemComponent) => this.selectTab(clickedTab)),
        withLatestFrom(this.tabs$),
        map(([clickedTab, tabs]: [ChipTabsItemComponent, ChipTabsItemComponent[]]) =>
          tabs.filter((tab: ChipTabsItemComponent) => tab.id !== clickedTab.id)
        )
      )
      .subscribe((notClickedTabs: ChipTabsItemComponent[]) => {
        notClickedTabs.forEach((tab: ChipTabsItemComponent) => tab.deselect());
      });
  }

  private selectTab(tab: ChipTabsItemComponent): void {
    tab.select();
    this.emitSelectedTabIndex(tab.id);
  }

  private emitSelectedTabIndex(tabId: Uuid): void {
    this.tabs$
      .pipe(
        take(1),
        map((tabs: ChipTabsItemComponent[]) => tabs.map((tab: ChipTabsItemComponent) => tab.id)),
        map((tabIds: Uuid[]) => tabIds.indexOf(tabId))
      )
      .subscribe((index: number) => this.selectedTabIndex.emit(index));
  }
}
