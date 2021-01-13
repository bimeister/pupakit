import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNil, Nullable } from '@bimeister/utilities/common';
import { shareReplayWithRefCount } from '@bimeister/utilities/rxjs';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { OnChangeCallback } from '../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../internal/declarations/types/on-touched-callback.type';

@Injectable({
  providedIn: 'any'
})
export class TableInputStateService<T> {
  public readonly currentValue$: BehaviorSubject<string> = new BehaviorSubject('');

  public readonly isDisabled$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);

  private readonly control$: BehaviorSubject<Nullable<NgControl>> = new BehaviorSubject(null);
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

  public defineOnChangeCallback(onChange: OnChangeCallback<T>): void {
    this.onChangeCallback$.next(onChange);
  }

  public defineOnTouchedCallback(onTouched: OnTouchedCallback): void {
    this.onTouchedCallback$.next(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    const nextDisabledValue: Nullable<boolean> = isDisabled ? true : null;
    this.isDisabled$.next(nextDisabledValue);
  }

  public setValue(value: T): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.currentValue$.next(serializedValue);
  }

  public setControlRef(control: NgControl): void {
    this.control$.next(control);
  }

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
}
