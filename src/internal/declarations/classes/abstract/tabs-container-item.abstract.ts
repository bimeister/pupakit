import { Directive, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { filterNotNil, filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { TabsStateProducerService } from './tabs-state-producer-service.abstract';

/**
 * @deprecated
 */
@Directive()
export abstract class TabsContainerItem implements OnChanges, OnInit {
  @Input() public isVisible: boolean = true;
  public readonly isVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  @Input() public isActive: boolean = false;
  public readonly isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() public value: unknown;
  public readonly value$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);

  constructor(protected readonly tabsStateService: TabsStateProducerService) {}

  @HostListener('click')
  public processTabClick(): void {
    this.value$.pipe(take(1), filterNotNil()).subscribe((value: unknown) => {
      this.tabsStateService.processTabClick(value);
    });
  }

  public ngOnInit(): void {
    this.setActiveTabStateInSet();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsVisibleValueChanges(changes?.isVisible);
    this.processIsActiveValueChanges(changes?.isActive);
    this.processValueChanges(changes?.value);
  }

  private setActiveTabStateInSet(): void {
    this.isActive$
      .pipe(
        take(1),
        filterTruthy(),
        switchMap(() => this.value$),
        take(1)
      )
      .subscribe((value: unknown) => this.tabsStateService.addToActiveTabValueSet(value));
  }

  private processIsVisibleValueChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isVisible$.next(updatedValue);
  }

  private processIsActiveValueChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isActive$.next(updatedValue);
  }

  private processValueChanges(change: ComponentChange<this, unknown>): void {
    const updatedValue: unknown | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.value$.next(updatedValue);
  }
}
