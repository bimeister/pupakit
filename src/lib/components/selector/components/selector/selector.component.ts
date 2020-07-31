import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  OnDestroy,
  OnInit,
  Optional,
  QueryList
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SelectorItemComponent } from '../selector-item/selector-item.component';

@Component({
  selector: 'pupa-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorComponent<T> implements AfterContentInit, OnInit, OnDestroy, ControlValueAccessor {
  @ContentChildren(SelectorItemComponent)
  private readonly items: QueryList<SelectorItemComponent<T>> = new QueryList();
  private readonly items$: BehaviorSubject<SelectorItemComponent<T>[]> = new BehaviorSubject([]);
  private readonly itemsSelectStates$: Observable<boolean[]> = this.items$.pipe(
    switchMap((items: SelectorItemComponent<T>[]) =>
      combineLatest(items.map((item: SelectorItemComponent<T>) => item.isSelected$))
    )
  );
  public readonly isAtLeastOneItemSelected$: Observable<boolean> = this.itemsSelectStates$.pipe(
    map((states: boolean[]) => states.some((state: boolean) => state))
  );
  private readonly selectedItems$: Observable<SelectorItemComponent<T>[]> = this.items$.pipe(
    switchMap((items: SelectorItemComponent<T>[]) =>
      combineLatest(
        items.map((item: SelectorItemComponent<T>) =>
          item.isSelected$.pipe(map((state: boolean) => (state ? item : null)))
        )
      )
    ),
    map((items: SelectorItemComponent<T>[]) => items.filter((item: SelectorItemComponent<T>) => item))
  );

  private onFormChange: (value: T[]) => void;
  private onFormTouch: () => void;
  private isTouched: boolean = false;
  private touchesCount: number = 0;

  public isEnabled: boolean = true;

  private selectedItemsSubscription: Subscription;

  constructor(private readonly changeDetector: ChangeDetectorRef, @Optional() readonly ngControl: NgControl) {
    if (!isNil(ngControl)) {
      ngControl.valueAccessor = this;
    }
  }
  public ngOnInit(): void {
    this.selectedItemsSubscription = this.selectedItems$.subscribe(this.onSelectedItemsUpdate.bind(this));
  }
  public ngOnDestroy(): void {
    this.selectedItemsSubscription?.unsubscribe();
  }

  public ngAfterContentInit(): void {
    this.items$.next(this.items.toArray());
  }

  public clearSelection(): void {
    this.items.forEach((item: SelectorItemComponent<T>) => item.setSelected(false));
  }
  public clearSelectionIfEnabled(): void {
    if (this.isEnabled) {
      this.clearSelection();
    }
  }

  public writeValue(outerValues: T[]): void {
    this.items.forEach((item: SelectorItemComponent<T>) => {
      item.setSelected(false);
      if (outerValues.some((outerValue: T) => outerValue === item.value)) {
        item.setSelected(true);
      }
    });
  }
  public registerOnChange(outerOnChange: (value: T[]) => void): void {
    this.onFormChange = outerOnChange;
  }
  public registerOnTouched(outerOnTouch: () => void): void {
    this.onFormTouch = outerOnTouch;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.isEnabled = !isDisabled;

    this.items.forEach(item => item.setEnabled(this.isEnabled));

    this.changeDetector.detectChanges();
  }

  private onSelectedItemsUpdate(items: SelectorItemComponent<T>[]): void {
    if (!isNil(this.onFormChange)) {
      this.onFormChange(items.map(item => item.value));
    }

    if (!this.isTouched) {
      this.touchesCount++;
    }
    if (this.touchesCount >= 1 && !this.isTouched) {
      this.isTouched = true;
    }
    if (!isNil(this.onFormTouch) && this.isTouched) {
      this.onFormTouch();
    }
  }
}
