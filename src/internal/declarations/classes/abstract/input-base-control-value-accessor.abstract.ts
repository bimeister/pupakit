import { Directive, Optional } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isNil, shareReplayWithRefCount } from '@meistersoft/utilities';
import { Nullable } from '@meistersoft/utilities/internal/types/nullable.type';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { OnChangeCallback } from '../../types/on-change-callback.type';
import { OnTouchedCallback } from '../../types/on-touched-callback.type';

@Directive()
export abstract class InputBaseControlValueAccessor<T> implements ControlValueAccessor {
  protected readonly control$: BehaviorSubject<Nullable<NgControl>> = new BehaviorSubject(null);
  public readonly value$: BehaviorSubject<T> = new BehaviorSubject(null);

  public readonly isDisabled$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);

  public readonly isValid$: Observable<boolean> = this.control$.pipe(
    switchMap((control: NgControl) =>
      isNil(control)
        ? of(true)
        : control.statusChanges.pipe(
            startWith(control.status),
            map((status: string) => status === 'VALID')
          )
    ),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  private readonly onChangeCallback$: BehaviorSubject<OnChangeCallback<T>> = new BehaviorSubject<OnChangeCallback<T>>(
    null
  );
  private readonly onTouchedCallback$: BehaviorSubject<OnChangeCallback<T[]>> = new BehaviorSubject<OnTouchedCallback>(
    null
  );

  constructor(@Optional() ngControl: NgControl) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;

    this.setControlRef(ngControl);
  }

  protected abstract setValue(value: T): void;

  public updateValue(updatedValue: T): void {
    this.setValue(updatedValue);
    this.isTouched$.next(true);

    combineLatest([this.onChangeCallback$, this.onTouchedCallback$])
      .pipe(take(1))
      .subscribe(([onChangeCallback, onTouchedCallback]: [OnChangeCallback<T>, OnTouchedCallback]) => {
        if (typeof onChangeCallback === 'function') {
          onChangeCallback(updatedValue);
        }

        if (typeof onTouchedCallback === 'function') {
          onTouchedCallback();
        }
      });
  }

  public writeValue(newValue: T): void {
    this.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.onChangeCallback$.next(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.onTouchedCallback$.next(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.processSetDisabledState(isDisabled);
  }

  private processSetDisabledState(isDisabled: boolean): void {
    const nextDisabledValue: Nullable<boolean> = isDisabled ? true : null;
    this.isDisabled$.next(nextDisabledValue);
  }

  private setControlRef(control: NgControl): void {
    this.control$.next(control);
  }
}
