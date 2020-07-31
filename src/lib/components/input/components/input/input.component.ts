import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';

import { InputSize } from '../../../../../internal/declarations/types/input-size.type';
import { InputTextAlign } from '../../../../../internal/declarations/types/input-text-align.type';
import { InputType } from '../../../../../internal/declarations/types/input-type.type';
import { getRangeEndDate } from '../../../../../internal/helpers/get-range-end-date.helper';
import { getRangeStartDate } from '../../../../../internal/helpers/get-range-start-date.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';

type DateRange = [Date, Date];
type ValueType = string | Date | null | number | DateRange;

@Component({
  selector: 'pupa-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor, Validator {
  @ViewChild('inputElement', { static: false }) public inputElement: ElementRef<HTMLInputElement>;
  @Input() public showValidateIcon: boolean = false;
  @Input() public type: InputType = 'text';
  @Input() public size: InputSize = 'medium';
  @Input() public transparent: boolean = false;
  @Input()
  public set valid(newValue: boolean) {
    this.validValue = newValue;
  }
  public get valid(): boolean {
    if (isNil(this.formControl)) {
      return this.validValue;
    }
    return this.formControl.valid;
  }
  @Input()
  public set disabled(newValue: boolean) {
    this.disabledValue = newValue;
  }
  public get disabled(): boolean {
    if (isNil(this.formControl)) {
      return this.disabledValue;
    }
    return this.formControl.disabled;
  }
  @Input() public readonly: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  @Input() public autocomplete: boolean = false;
  @Input() public textAlign: InputTextAlign = 'left';
  @Input()
  public get value(): ValueType {
    return this.valueData;
  }
  public set value(newValue: ValueType) {
    this.updateValue(newValue);
  }
  public get stringValue(): string {
    if (isNil(this.value)) {
      return '';
    }
    if (typeof this.value === 'string') {
      return this.value;
    }
    if (this.value instanceof Date) {
      return this.value.toISOString();
    }
  }

  @Output() public valueChange: EventEmitter<ValueType> = new EventEmitter<ValueType>();

  @Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  public set touched(newValue: boolean) {
    this.touchedValue = newValue;
  }

  public get touched(): boolean {
    if (isNil(this.formControl)) {
      return this.touchedValue;
    }
    return this.formControl.touched;
  }

  public isDatePickerVisible: boolean = false;

  public get isDateInput(): boolean {
    return this.type.toLowerCase() === 'date' || this.type.toLowerCase() === 'date-range';
  }

  private valueData: ValueType = null;
  private touchedValue: boolean = false;
  private disabledValue: boolean = false;
  private validValue: boolean = false;

  public get formControl(): AbstractControl {
    return !isNil(this.ngControl) ? this.ngControl.control : null;
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef, @Optional() public readonly ngControl: NgControl) {
    if (!isNil(ngControl)) {
      ngControl.valueAccessor = this;
    }
  }

  public showDatePicker(event: MouseEvent): void {
    event.stopPropagation();
    this.isDatePickerVisible = true;
  }

  public registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFunction): void {
    this.onTouched = (): void => {
      fn();
      this.touchedValue = true;
    };
  }

  public writeValue(outerValue: unknown): void {
    queueMicrotask(() => {
      this.valueData = this.getSanitizedValue(outerValue, this.type);
      this.changeDetectorRef.markForCheck();
    });
  }

  public updateValue(innerValue: ValueType): void {
    this.isDatePickerVisible = false;
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  public validate(control: AbstractControl | NgControl): ValidationErrors | null {
    if (!isNil(this.valid)) {
      return this.valid ? null : { manualError: true };
    }
    if (isNil(control) || isNil(control.errors) || control.pristine || control.untouched || control.disabled) {
      return null;
    }
    return control.errors;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabledValue = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  public emitFocusEvent(focusEvent: FocusEvent): void {
    this.focus.emit(focusEvent);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    this.blur.emit(blurEvent);
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };

  public readonly isDate = (value: unknown): boolean => {
    return isDate(value);
  };

  public readonly getRangeStart = (value: unknown): Date => {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));
    if (Array.isArray(parsedValue)) {
      return getRangeStartDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeStartDate(value);
  };

  public readonly getRangeEnd = (value: unknown): Date => {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));
    if (Array.isArray(parsedValue)) {
      return getRangeEndDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeEndDate(value);
  };

  private readonly getSanitizedValue: (value: unknown, type: InputType) => ValueType = (
    value: unknown,
    type: InputType
  ): ValueType => {
    if (isNil(value)) {
      return null;
    }

    const isDateInput: boolean = type === 'date';
    if (isDateInput && isDate(value)) {
      return new Date(String(value));
    }

    const isDateRangeInput: boolean = type === 'date-range';
    if (isDateRangeInput) {
      return [new Date(String(value[0])), new Date(String(value[1]))];
    }

    const isNumberInput: boolean = type === 'number';
    const decimalBase: number = 10;
    const parsedNumber: number = Number.parseInt(String(value), decimalBase);
    if (isNumberInput && !Number.isNaN(parsedNumber)) {
      return parsedNumber;
    }

    return String(value);
  };
}
