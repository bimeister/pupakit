import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, take, withLatestFrom } from 'rxjs/operators';

import { OnChangeCallback } from '../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../internal/declarations/types/on-touched-callback.type';
import { isNullOrUndefined } from '../../../../internal/helpers/is-null-or-undefined.helper';

@Injectable({
  providedIn: 'any'
})
export class SelectNewStateService<T> {
  private readonly currentSerializedValue$: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(
    new Set<string>()
  );
  public readonly currentValue$: Observable<T[]> = this.currentSerializedValue$.pipe(
    map((serializedSet: Set<string>) => SelectNewStateService.getParsedValue<T>(serializedSet)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly isMultiSelectionEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly onChangeCallback$: BehaviorSubject<OnChangeCallback<T[]>> = new BehaviorSubject<
    OnChangeCallback<T[]>
  >(null);
  public readonly onTouchedCallback$: BehaviorSubject<OnChangeCallback<T[]>> = new BehaviorSubject<OnTouchedCallback>(
    null
  );

  public readonly dropDownOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin> = new BehaviorSubject<CdkOverlayOrigin>(
    null
  );

  public collapse(): void {
    this.isExpanded$.next(false);
  }

  public toggleExpansion(): void {
    this.isExpanded$.pipe(take(1)).subscribe((isExpanded: boolean) => {
      this.isExpanded$.next(!isExpanded);
    });
  }

  public defineOverlayOrigin(overlayOrigin: CdkOverlayOrigin): void {
    this.dropDownOverlayOrigin$.next(overlayOrigin);
  }

  public defineOnChangeCallback(onChange: OnChangeCallback<T[]>): void {
    this.onChangeCallback$.next(onChange);
  }

  public defineOnTouchedCallback(onTouched: OnTouchedCallback): void {
    this.onTouchedCallback$.next(onTouched);
  }

  public setMultiSelectionState(isEnabled: boolean): void {
    this.isMultiSelectionEnabled$.next(isEnabled);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled$.next(isDisabled);
  }

  public processClick(value: T): void {
    this.isMultiSelectionEnabled$
      .pipe(
        take(1),
        withLatestFrom(this.currentSerializedValue$),
        map(([isMultiSelectionEnabled, currentSerializedValue]: [boolean, Set<string>]) => {
          const upcomingSerializedValue: string = JSON.stringify(value);

          const upcomingValueAlreadyExists: boolean = currentSerializedValue.has(upcomingSerializedValue);

          const currentSerializedValueItems: string[] = Array.from(currentSerializedValue.values());

          if (isMultiSelectionEnabled && upcomingValueAlreadyExists) {
            const updatedItems: string[] = currentSerializedValueItems.filter(
              (valueItem: string) => valueItem !== upcomingSerializedValue
            );
            return new Set<string>(updatedItems);
          }

          if (isMultiSelectionEnabled && !upcomingValueAlreadyExists) {
            const updatedItems: string[] = [...currentSerializedValueItems, upcomingSerializedValue];
            return new Set<string>(updatedItems);
          }

          if (!isMultiSelectionEnabled && !upcomingValueAlreadyExists) {
            return new Set<string>([upcomingSerializedValue]);
          }

          return new Set<string>();
        }),
        withLatestFrom(this.onChangeCallback$, this.onTouchedCallback$, this.isMultiSelectionEnabled$)
      )
      .subscribe(
        ([updatedValue, onChangeCallback, onTouchedCallback, isMultiSelectionEnabled]: [
          Set<string>,
          OnChangeCallback<T[]>,
          OnTouchedCallback,
          boolean
        ]) => {
          this.currentSerializedValue$.next(updatedValue);

          if (typeof onChangeCallback === 'function') {
            const parsedValue: T[] = SelectNewStateService.getParsedValue<T>(updatedValue);
            onChangeCallback(parsedValue);
          }

          if (typeof onTouchedCallback === 'function') {
            onTouchedCallback();
          }

          if (!isMultiSelectionEnabled) {
            this.collapse();
          }
        }
      );
  }

  public isPicked(value: T): Observable<boolean> {
    return this.currentSerializedValue$.pipe(
      map((serializedSet: Set<string>) => {
        const serializedValue: string = JSON.stringify(value);
        return serializedSet.has(serializedValue);
      })
    );
  }

  public setValue(value: T[]): void {
    const serializedValue: string[] = isNullOrUndefined(value)
      ? []
      : value.map((valueItem: T) => JSON.stringify(valueItem));
    const serializedSet: Set<string> = new Set<string>(serializedValue);
    this.currentSerializedValue$.next(serializedSet);
  }

  private static getParsedValue<V>(serializedSet: Set<string>): V[] {
    return Array.from(serializedSet.values()).map((setValue: string) => JSON.parse(setValue));
  }
}
