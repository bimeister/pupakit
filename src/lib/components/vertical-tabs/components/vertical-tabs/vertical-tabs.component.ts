import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation
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
  switchMapTo,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { VerticalTabsItemComponent } from '../vertical-tabs-item/vertical-tabs-item.component';

@Component({
  selector: 'pupa-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsComponent implements AfterContentChecked, OnDestroy {
  @Input() public isAutoSelectionDisabled: boolean = false;

  @ContentChildren(VerticalTabsItemComponent) private readonly tabsList: QueryList<VerticalTabsItemComponent>;

  @Output() public readonly selectedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  private readonly subscription: Subscription = new Subscription();

  private readonly tabs$: BehaviorSubject<VerticalTabsItemComponent[]> = new BehaviorSubject<
    VerticalTabsItemComponent[]
  >([]);
  private readonly clickedTab$: Observable<VerticalTabsItemComponent> = this.tabs$.pipe(
    switchMap((tabs: VerticalTabsItemComponent[]) => {
      const tabsTriggers$: Observable<VerticalTabsItemComponent>[] = tabs.map(
        (tab: VerticalTabsItemComponent) => tab.clicked$
      );
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

  private updateTabsClickTriggers(): void {
    const tabs: VerticalTabsItemComponent[] = this.tabsList.toArray();
    this.tabs$.next(tabs);
  }

  private selectFirstIfNoneIsSelected(): void {
    this.tabIsClicked$
      .pipe(
        filter(() => !this.isAutoSelectionDisabled),
        take(1),
        filter((isClicked: boolean) => !isClicked),
        switchMapTo(
          this.tabs$.pipe(
            take(1),
            map((tabs: VerticalTabsItemComponent[]) =>
              tabs.filter((tab: VerticalTabsItemComponent) => !tab.isAutoSelectionDisabled)
            ),
            filter((tabs: VerticalTabsItemComponent[]) => Array.isArray(tabs)),
            pluck(0),
            filter((firstTab: VerticalTabsItemComponent) => !isNullOrUndefined(firstTab))
          )
        )
      )
      .subscribe((firstTab: VerticalTabsItemComponent) => this.selectTab(firstTab));
  }

  private updateItemSelectionOnClick(): Subscription {
    return this.clickedTab$
      .pipe(
        filter((clickedTab: VerticalTabsItemComponent) => !isNullOrUndefined(clickedTab)),
        tap((clickedTab: VerticalTabsItemComponent) => this.selectTab(clickedTab)),
        withLatestFrom(this.tabs$),
        map(([clickedTab, tabs]: [VerticalTabsItemComponent, VerticalTabsItemComponent[]]) =>
          tabs.filter((tab: VerticalTabsItemComponent) => tab.id !== clickedTab.id)
        )
      )
      .subscribe((notClickedTabs: VerticalTabsItemComponent[]) => {
        notClickedTabs.forEach((tab: VerticalTabsItemComponent) => tab.deselect());
      });
  }

  private selectTab(tab: VerticalTabsItemComponent): void {
    tab.select();
    this.emitSelectedTabIndex(tab.id);
  }

  private emitSelectedTabIndex(tabId: Uuid): void {
    this.tabs$
      .pipe(
        take(1),
        map((tabs: VerticalTabsItemComponent[]) => tabs.map((tab: VerticalTabsItemComponent) => tab.id)),
        map((tabIds: Uuid[]) => tabIds.indexOf(tabId))
      )
      .subscribe((index: number) => this.selectedTabIndex.emit(index));
  }
}
