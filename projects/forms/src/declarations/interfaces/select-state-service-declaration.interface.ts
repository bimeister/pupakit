import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter, TemplateRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { OnChangeCallback } from '../types/on-change-callback.type';
import { OnTouchedCallback } from '../types/on-touched-callback.type';
import { SelectOuterValue } from '../types/select-outer-value.type';
import { SelectSize } from '../types/select-size.type';

export interface SelectStateServiceDeclaration<T> {
  readonly currentValue$: Observable<T[]>;

  readonly isDisabled$: BehaviorSubject<boolean>;
  readonly isExpanded$: BehaviorSubject<boolean>;

  readonly dropdownOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin>;
  readonly dropdownOverlayRef$: BehaviorSubject<OverlayRef>;
  readonly dropdownTriggerButtonWidthPx$: Observable<number>;

  readonly control$: BehaviorSubject<Nullable<NgControl>>;
  readonly isTouched$: BehaviorSubject<Nullable<boolean>>;
  readonly isPatched$: BehaviorSubject<Nullable<boolean>>;
  readonly isValid$: Observable<boolean>;
  readonly isFilled$: BehaviorSubject<boolean>;

  readonly placeholder$: BehaviorSubject<Nullable<string>>;
  readonly withReset$: BehaviorSubject<boolean>;
  readonly inline$: BehaviorSubject<boolean>;
  readonly size$: BehaviorSubject<SelectSize>;
  readonly defaultValue$: BehaviorSubject<Nullable<T>>;

  readonly isTriggerTouched$: BehaviorSubject<boolean>;

  readonly invalidTooltipHideOnHover$: BehaviorSubject<boolean>;
  readonly invalidTooltipDisabled$: BehaviorSubject<boolean>;
  readonly invalidTooltip$: BehaviorSubject<Nullable<string>>;
  readonly invalidTooltipContentTemplate$: BehaviorSubject<Nullable<TemplateRef<unknown>>>;

  readonly resetOutput: EventEmitter<void>;

  setControlRef(control: NgControl): void;

  collapse(): void;
  open(): void;
  toggleExpansion(): void;

  defineDropdownTrigger(overlayOrigin: CdkOverlayOrigin, buttonElement: HTMLButtonElement): void;
  defineDropdownOverlayRef(overlayRef: OverlayRef): void;
  defineOnChangeCallback(onChange: OnChangeCallback<T[]>): void;
  defineOnTouchedCallback(onTouched: OnTouchedCallback): void;

  setMultiSelectionState(isEnabled: boolean): void;
  setUnselectionState(isEnabled: boolean): void;
  setIsPatchedState(isPatched: boolean): void;
  setPlaceholderState(placeholder: string): void;
  setWithResetState(withReset: boolean): void;
  setInlineState(inline: boolean): void;
  setSizeState(size: SelectSize): void;
  setDefaultValueState(defaultValue: T): void;
  setDisabledState(isDisabled: boolean): void;

  setInvalidTooltipHideOnHoverState(invalidTooltipHideOnHover: boolean): void;
  setInvalidTooltipDisabledState(invalidTooltipDisabled: boolean): void;
  setInvalidTooltipState(invalidTooltip: Nullable<string>): void;
  setInvalidTooltipContentTemplateState(invalidTooltipContentTemplate: Nullable<TemplateRef<unknown>>): void;
  setIsTriggerTouchedState(isTriggered: boolean): void;

  processSelection(value: T): void;
  isPicked(value: T): Observable<boolean>;
  setValue(value: SelectOuterValue<T>): void;
  reset(): void;
  setIsFilled(isFilled: boolean): void;
}
