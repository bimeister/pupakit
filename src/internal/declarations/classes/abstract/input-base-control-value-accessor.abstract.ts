import { Directive, OnDestroy, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isNil, shareReplayWithRefCount } from '@meistersoft/utilities';
import { Nullable } from '@meistersoft/utilities/internal/types/nullable.type';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BrowserService } from '../../../shared/services/browser.service';
import { OnChangeCallback } from '../../types/on-change-callback.type';
import { OnTouchedCallback } from '../../types/on-touched-callback.type';

@Directive()
export abstract class InputBaseControlValueAccessor<T> implements ControlValueAccessor, OnDestroy, OnInit {
  protected readonly control$: BehaviorSubject<Nullable<NgControl>> = new BehaviorSubject(null);
  public readonly value$: BehaviorSubject<T> = new BehaviorSubject(null);

  public readonly isDisabled$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isFocused$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);

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

  private readonly subscription: Subscription = new Subscription();

  constructor(protected readonly browserService: BrowserService, @Optional() private readonly ngControl: NgControl) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;
    this.setControlRef(ngControl);
  }

  protected abstract setValue(value: T): void;

  protected handleChangedValue(onChangeCallback: OnChangeCallback<any>, value: T): void {
    onChangeCallback(value);
  }

  public ngOnInit(): void {
    this.subscription.add(this.processNgControlStatusChangesForHandleIsTouched());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updateValue(updatedValue: T): void {
    this.setValue(updatedValue);
    this.isTouched$.next(true);

    combineLatest([this.onChangeCallback$, this.onTouchedCallback$])
      .pipe(take(1))
      .subscribe(([onChangeCallback, onTouchedCallback]: [OnChangeCallback<T>, OnTouchedCallback]) => {
        if (typeof onChangeCallback === 'function') {
          this.handleChangedValue(onChangeCallback, updatedValue);
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

  private processNgControlStatusChangesForHandleIsTouched(): Subscription {
    return this.ngControl.statusChanges
      .pipe(
        startWith(this.ngControl.touched),
        map(() => this.ngControl.touched),
        tap((isTouched: boolean) => this.isTouched$.next(isTouched))
      )
      .subscribe();
  }
}
