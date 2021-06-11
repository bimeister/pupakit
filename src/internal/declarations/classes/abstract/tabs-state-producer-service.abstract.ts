import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { distinctUntilSerializedChanged, filterFalsy, filterTruthy } from '@bimeister/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, skipUntil, take, withLatestFrom } from 'rxjs/operators';

@Injectable()
export abstract class TabsStateProducerService implements OnDestroy {
  protected readonly subscription: Subscription = new Subscription();
  protected readonly activeTabValueSet$: BehaviorSubject<Set<unknown>> = new BehaviorSubject<Set<unknown>>(
    new Set<unknown>()
  );
  protected readonly isViewInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isMultiSelectionEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isTabWasClicked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly selectedTabValues: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();

  constructor() {
    this.subscription.add(this.processEmitActiveTabValues()).add(this.processIsMultiSelectionEnabledChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setViewInit(): void {
    this.isViewInit$.next(true);
  }

  public processTabClick(value: unknown): void {
    this.isTabWasClicked$.next(true);
    this.changeActiveTabValueSetByValue(value);
  }

  public addToActiveTabValueSet(value: unknown): void {
    this.isMultiSelectionEnabled$
      .pipe(take(1), withLatestFrom(this.activeTabValueSet$))
      .subscribe(([isMultiSelectionEnabled, activeTabValueSet]: [boolean, Set<unknown>]) => {
        const updatedSet: Set<unknown> = new Set(activeTabValueSet);
        if (!isMultiSelectionEnabled) {
          updatedSet.clear();
        }

        updatedSet.add(value);
        this.activeTabValueSet$.next(updatedSet);
      });
  }

  public changeActiveTabValueSetByValue(value: unknown): void {
    this.isMultiSelectionEnabled$
      .pipe(take(1), withLatestFrom(this.activeTabValueSet$))
      .subscribe(([isMultiSelectionEnabled, activeTabValueSet]: [boolean, Set<unknown>]) => {
        const isValueInActiveTabsSet: boolean = activeTabValueSet.has(value);
        if (isMultiSelectionEnabled) {
          isValueInActiveTabsSet ? activeTabValueSet.delete(value) : activeTabValueSet.add(value);
          this.activeTabValueSet$.next(activeTabValueSet);
          return;
        }

        if (isValueInActiveTabsSet) {
          return;
        }

        activeTabValueSet.clear();
        activeTabValueSet.add(value);
        this.activeTabValueSet$.next(activeTabValueSet);
      });
  }

  private processEmitActiveTabValues(): Subscription {
    return this.activeTabValueSet$
      .pipe(
        skipUntil(this.isTabWasClicked$.pipe(filterTruthy(), take(1))),
        map((activeTabValueSet: Set<unknown>) => Array.from(activeTabValueSet.values())),
        distinctUntilSerializedChanged()
      )
      .subscribe((values: unknown[]) => this.selectedTabValues.emit(values));
  }

  private processIsMultiSelectionEnabledChanges(): Subscription {
    return this.isMultiSelectionEnabled$
      .pipe(
        filterFalsy(),
        withLatestFrom(this.activeTabValueSet$),
        filter(([_isMultiSelectionEnabled, activeTabValueSet]: [boolean, Set<unknown>]) => activeTabValueSet.size > 1)
      )
      .subscribe(([_isMultiSelectionEnabled, activeTabValueSet]: [boolean, Set<unknown>]) => {
        const serializedActiveTabValueSet: Set<unknown> = new Set<unknown>(
          Array.from(activeTabValueSet.values()).slice(-1)
        );
        this.activeTabValueSet$.next(serializedActiveTabValueSet);
      });
  }
}
