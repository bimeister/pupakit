import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, NgControl } from '@angular/forms';
import { isNil } from '@bimeister/utilities/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { VOID } from '../../../../../internal/constants/void.const';

type OnChangeCallback = (value: number[]) => void;
type OnTouchedCallback = VoidFunction;

@Component({
  selector: 'pupa-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeInputComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  public readonly internalArray: FormArray = new FormArray([]);
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isValid$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private readonly subscription: Subscription = new Subscription();

  constructor(@Optional() readonly ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }
  public ngAfterViewInit(): void {
    this.subscription.add(this.updateOnChange()).add(this.updateValidation());
  }
  public ngOnDestroy(): void {
    this.internalArray.clear();
    this.subscription.unsubscribe();
  }
  public writeValue(incomingData: number[]): void {
    if (!Array.isArray(incomingData)) {
      throw new Error('Not array type data provided');
    }

    this.internalArray.setValue(incomingData.map((data: number) => String(data)));
  }
  public registerOnChange(fn: OnChangeCallback): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: VoidFunction): void {
    this.onTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled$.next(isDisabled);
    this.internalArray.controls.forEach((control: AbstractControl) =>
      isDisabled ? control.disable() : control.enable()
    );
  }
  public onTouch: OnTouchedCallback = () => VOID;

  private updateOnChange(): Subscription {
    return this.internalArray.valueChanges
      .pipe(
        map((stringyValues: string[]) => stringyValues.map((stringyValue: string) => Number.parseInt(stringyValue, 10)))
      )
      .subscribe((numericValues: number[]) => {
        this.onChange(numericValues);
      });
  }
  private updateValidation(): Subscription {
    if (isNil(this.ngControl)) {
      return new Subscription();
    }

    return this.ngControl.valueChanges
      .pipe(
        filter((data: number[]) => data.length === this.internalArray.controls.length),
        distinctUntilChanged(
          (previousData: number[], currentData: number[]) =>
            JSON.stringify(previousData) !== JSON.stringify(currentData)
        )
      )
      .subscribe(() => {
        this.isValid$.next(this.ngControl.valid);
      });
  }

  private onChange: OnChangeCallback = () => VOID;
}
