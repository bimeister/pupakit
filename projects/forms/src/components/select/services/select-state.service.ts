import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ElementRef, EventEmitter, Inject, Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { FormControlStatus, NgControl } from '@angular/forms';
import { filterNotNil, isEmpty, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { isFormControlValidStatus } from '../../../declarations/functions/is-form-control-valid-status.function';
import { SelectStateServiceDeclaration as SelectStateServiceInterface } from '../../../declarations/interfaces/select-state-service-declaration.interface';
import { OnChangeCallback } from '../../../declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../declarations/types/on-touched-callback.type';
import { SelectOuterValue } from '../../../declarations/types/select-outer-value.type';
import { SelectSize } from '../../../declarations/types/select-size.type';

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
  public readonly control$: BehaviorSubject<Nullable<NgControl>> = new BehaviorSubject<Nullable<NgControl>>(null);
  public readonly isTouched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<Nullable<boolean>>(null);
  public readonly isPatched$: BehaviorSubject<Nullable<boolean>> = new BehaviorSubject<Nullable<boolean>>(null);
  public readonly isValid$: Observable<boolean> = this.control$.pipe(
    switchMap((control: NgControl) =>
      isNil(control)
        ? of(true)
        : control.statusChanges.pipe(
            startWith(control.status),
            map((status: FormControlStatus) => isFormControlValidStatus(status))
          )
    ),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  public readonly isFilled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly withReset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly inline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly size$: BehaviorSubject<SelectSize> = new BehaviorSubject<SelectSize>('medium');

  public readonly isTriggerTouched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly invalidTooltipHideOnHover$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly invalidTooltipDisabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly invalidTooltip$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public readonly invalidTooltipContentTemplate$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);

  public readonly placeholder$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  private readonly onChangeCallback$: BehaviorSubject<OnChangeCallback<SelectOuterValue<T>>> = new BehaviorSubject<
    OnChangeCallback<SelectOuterValue<T>>
  >(null);
  private readonly onTouchedCallback$: BehaviorSubject<OnTouchedCallback> = new BehaviorSubject<OnTouchedCallback>(
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

      const { width }: DOMRect = button?.getBoundingClientRect();
      return width;
    }),
    map((width: number | undefined) => (isNil(width) ? 0 : width))
  );

  public readonly resetOutput: EventEmitter<void> = new EventEmitter<void>();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

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
    this.listenOutsideEventsForClose();
  }

  public toggleExpansion(): void {
    this.isExpanded$.pipe(take(1)).subscribe((isExpanded: boolean) => {
      isExpanded ? this.collapse() : this.open();
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

  public setIsTriggerTouchedState(isTriggerTouched: boolean): void {
    this.isTriggerTouched$.next(isTriggerTouched);
  }

  public setUnselectionState(isEnabled: boolean): void {
    this.isUnselectionEnabled$.next(isEnabled);
  }

  public setIsPatchedState(isPatched: boolean): void {
    this.isPatched$.next(isPatched);
  }

  public setPlaceholderState(placeholder: string): void {
    this.placeholder$.next(placeholder);
  }

  public setWithResetState(withReset: boolean): void {
    this.withReset$.next(withReset);
  }

  public setInlineState(inline: boolean): void {
    this.inline$.next(inline);
  }

  public setSizeState(size: SelectSize): void {
    this.size$.next(size);
  }

  public setInvalidTooltipHideOnHoverState(invalidTooltipHideOnHover: boolean): void {
    this.invalidTooltipHideOnHover$.next(invalidTooltipHideOnHover);
  }

  public setInvalidTooltipDisabledState(invalidTooltipDisabled: boolean): void {
    this.invalidTooltipDisabled$.next(invalidTooltipDisabled);
  }

  public setInvalidTooltipState(invalidTooltip: Nullable<string>): void {
    this.invalidTooltip$.next(invalidTooltip);
  }

  public setInvalidTooltipContentTemplateState(invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>>): void {
    this.invalidTooltipContentTemplate$.next(invalidTooltipContentTemplate);
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
          this.setIsFilled(updatedValue.size !== 0);
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

  public setIsFilled(isFilled: boolean): void {
    this.isFilled$.next(isFilled);
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

  public reset(): void {
    this.control$
      .pipe(
        take(1),
        filterNotNil(),
        withLatestFrom(this.isMultiSelectionEnabled$, this.onTouchedCallback$, this.onChangeCallback$)
      )
      .subscribe(
        ([control, isMultiSelectionEnable, onTouchedCallback, onChangeCallback]: [
          NgControl,
          boolean,
          OnTouchedCallback,
          OnChangeCallback<T | T[]>
        ]) => {
          const resetValue: T | T[] = isMultiSelectionEnable ? [] : null;

          control.control.setValue(resetValue);

          if (typeof onTouchedCallback === 'function') {
            onTouchedCallback();
          }

          if (typeof onChangeCallback === 'function') {
            onChangeCallback(resetValue);
          }

          this.resetOutput.next();
        }
      );
  }

  public processFocusInputContainer(inputElement: ElementRef<HTMLInputElement>): Subscription {
    return this.isExpanded$
      .pipe(filter(() => !isNil(inputElement)))
      .subscribe((isExpanded: boolean) =>
        isExpanded ? inputElement.nativeElement.focus() : inputElement.nativeElement.blur()
      );
  }

  private listenOutsideEventsForClose(): void {
    const touchMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'resize');

    merge(touchMove$, wheel$, resize$)
      .pipe(take(1))
      .subscribe(() => this.collapse());
  }

  private static getParsedValue<V>(serializedSet: Set<string>): V[] {
    const parsedValue: V[] = Array.from(serializedSet.values()).map((setValue: string) => JSON.parse(setValue));
    return parsedValue;
  }
}
