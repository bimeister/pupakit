import { CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { NgControl } from '@angular/forms';
import { Nullable } from '@meistersoft/utilities/internal/types/nullable.type';
import { BehaviorSubject, Observable } from 'rxjs';

import { OnChangeCallback } from '../types/on-change-callback.type';
import { OnTouchedCallback } from '../types/on-touched-callback.type';
import { SelectOuterValue } from '../types/select-outer-value.type';

export interface SelectStateService<T> {
  readonly currentValue$: Observable<T[]>;

  readonly isDisabled$: BehaviorSubject<boolean>;
  readonly isExpanded$: BehaviorSubject<boolean>;

  readonly dropdownOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin>;
  readonly dropdownOverlayRef$: BehaviorSubject<OverlayRef>;
  readonly dropdownTriggerButtonWidthPx$: Observable<number>;

  readonly control$: BehaviorSubject<Nullable<NgControl>>;
  readonly isTouched$: BehaviorSubject<Nullable<boolean>>;
  readonly isValid$: Observable<boolean>;

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
  setDisabledState(isDisabled: boolean): void;

  processSelection(value: T): void;
  isPicked(value: T): Observable<boolean>;
  setValue(value: SelectOuterValue<T>): void;
}
