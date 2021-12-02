import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isEmpty, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { SelectStateService as SelectStateServiceInterface } from '../../../../internal/declarations/interfaces/select-state-service.interface';
import { OnChangeCallback } from '../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../internal/declarations/types/on-touched-callback.type';
import { SelectOuterValue } from '../../../../internal/declarations/types/select-outer-value.type';

/** @dynamic */
@Injectable({
  providedIn: 'any',
})
export class SelectStateService<T> implements SelectStateServiceInterface<T>, OnDestroy {
  private readonly currentSerializedValue$: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(
    new Set<string>()
  );
  public readonly currentValue$: Observable<T[]> = this.currentSerializedValue$.pipe(
    map((serializedSet: Set<string>) => SelectStateService.getParsedValue<T>(serializedSet)),
    shareReplayWithRefCount()
  );

  private readonly subscription: Subscription = new Subscription();

  private readonly isMultiSelectionEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly isUnselectionEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly control$: BehaviorSubject<Nullable<NgControl>> = new BehaviorSubject(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
  public readonly isPatched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<boolean>(null);
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

  private readonly onChangeCallback$: BehaviorSubject<OnChangeCallback<SelectOuterValue<T>>> = new BehaviorSubject<
    OnChangeCallback<SelectOuterValue<T>>
  >(null);
  private readonly onTouchedCallback$: BehaviorSubject<OnChangeCallback<T[]>> = new BehaviorSubject<OnTouchedCallback>(
    null
  );

  public readonly dropdownOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin> = new BehaviorSubject<CdkOverlayOrigin>(
    null
  );
  private readonly dropdownTriggerButton$: BehaviorSubject<HTMLButtonElement> = new BehaviorSubject<HTMLButtonElement>(
    null
  );
  public readonly dropdownOverlayRef$: BehaviorSubject<OverlayRef> = new BehaviorSubject<OverlayRef>(null);
  public readonly dropdownTriggerButtonWidthPx$: Observable<number> = this.dropdownTriggerButton$.pipe(
    map((button: HTMLButtonElement | null) => {
      if (isNil(button)) {
        return undefined;
      }

      const { width }: ClientRect = button?.getBoundingClientRect();
      return width;
    }),
    map((width: number | undefined) => (isNil(width) ? 0 : width))
  );

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setControlRef(control: NgControl): void {
    this.control$.next(control);
  }

  public collapse(): void {
    this.isExpanded$.next(false);
  }

  public open(): void {
    this.isExpanded$.next(true);
  }

  public toggleExpansion(): void {
    this.isExpanded$.pipe(take(1)).subscribe((isExpanded: boolean) => {
      this.isExpanded$.next(!isExpanded);
    });
  }

  public defineDropdownTrigger(overlayOrigin: CdkOverlayOrigin, buttonElement: HTMLButtonElement): void {
    this.dropdownOverlayOrigin$.next(overlayOrigin);
    this.dropdownTriggerButton$.next(buttonElement);
  }

  public defineDropdownOverlayRef(overlayRef: OverlayRef): void {
    this.dropdownOverlayRef$.next(overlayRef);
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

  public setUnselectionState(isEnabled: boolean): void {
    this.isUnselectionEnabled$.next(isEnabled);
  }

  public setIsPatchedState(isPatched: boolean): void {
    this.isPatched$.next(isPatched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled$.next(isDisabled);
  }

  public processSelection(value: T): void {
    combineLatest([this.isMultiSelectionEnabled$, this.isUnselectionEnabled$, this.currentSerializedValue$])
      .pipe(
        take(1),
        map(
          ([isMultiSelectionEnabled, isUnselectionEnabled, currentSerializedValue]: [
            boolean,
            boolean,
            Set<string>
          ]) => {
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
            return isUnselectionEnabled ? new Set<string>() : new Set<string>(currentSerializedValue);
          }
        ),
        withLatestFrom(this.onChangeCallback$, this.onTouchedCallback$, this.isMultiSelectionEnabled$)
      )
      .subscribe(
        ([updatedValue, onChangeCallback, onTouchedCallback, isMultiSelectionEnabled]: [
          Set<string>,
          OnChangeCallback<SelectOuterValue<T>>,
          OnTouchedCallback,
          boolean
        ]) => {
          this.currentSerializedValue$.next(updatedValue);
          this.isTouched$.next(true);

          if (typeof onChangeCallback === 'function') {
            const parsedValue: T[] = SelectStateService.getParsedValue<T>(updatedValue);
            onChangeCallback(isMultiSelectionEnabled ? parsedValue : parsedValue[0]);
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

  public setValue(value: SelectOuterValue<T>): void {
    const sanitizedValue: T[] = Array.isArray(value) ? value : [value];
    const serializedValue: string[] = sanitizedValue.map((valueItem: T) => JSON.stringify(valueItem));
    const serializedSet: Set<string> = new Set<string>(serializedValue);
    this.currentSerializedValue$.next(serializedSet);

    if (!isEmpty(value)) {
      this.isTouched$.next(true);
    }
  }

  public processFocusInputContainer(inputElement: ElementRef<HTMLInputElement>): Subscription {
    return this.isExpanded$
      .pipe(filter(() => !isNil(inputElement)))
      .subscribe((isExpanded: boolean) =>
        isExpanded ? inputElement.nativeElement.focus() : inputElement.nativeElement.blur()
      );
  }

  private static getParsedValue<V>(serializedSet: Set<string>): V[] {
    const parsedValue: V[] = Array.from(serializedSet.values()).map((setValue: string) => JSON.parse(setValue));
    return parsedValue;
  }
}
