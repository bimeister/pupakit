import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'pupa-multiselection-list',
  templateUrl: './multiselection-list.component.html',
  styleUrls: ['./multiselection-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectionListComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectionListComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly selectedValues$: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set<string>());
  private readonly subscription: Subscription = new Subscription();

  @Input() public set value(value: string[]) {
    if (isNil(value)) {
      return;
    }
    this.selectedValues$.next(new Set<string>(value));
  }
  @Output() public change: EventEmitter<string[]> = new EventEmitter<string[]>();

  private onChange: (selectedValues: string[]) => void;
  private onTouched: () => void;

  public ngAfterViewInit(): void {
    this.subscription.add(this.handleSelectedValuesChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public writeValue(selectedValues: string[]): void {
    this.selectedValues$.next(new Set<string>(selectedValues));
  }

  public registerOnChange(fn: (selectedValues: string[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled$.next(isDisabled);
  }

  public toggleValue(value: string): void {
    this.selectedValues$
      .pipe(
        take(1),
        withLatestFrom(this.isDisabled$),
        filter(([_, isDisabled]: [Set<string>, boolean]) => !isDisabled),
        map(([selectedValues]: [Set<string>, boolean]) => selectedValues)
      )
      .subscribe((selectedValues: Set<string>) =>
        this.selectedValues$.next(MultiselectionListComponent.toggleValueInSet(selectedValues, value))
      );
  }

  private handleSelectedValuesChanges(): Subscription {
    return this.selectedValues$.subscribe((selectedValues: Set<string>) => {
      const values: string[] = Array.from(selectedValues.values());
      this.change.emit(values);
      if (this.onChange) {
        this.onChange(values);
      }
      if (this.onTouched) {
        this.onTouched();
      }
    });
  }

  private static toggleValueInSet(set: Set<string>, value: string): Set<string> {
    if (set.has(value)) {
      set.delete(value);
      return set;
    }

    set.add(value);
    return set;
  }
}
