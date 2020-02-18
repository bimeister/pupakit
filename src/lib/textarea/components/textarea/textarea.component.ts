import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator } from '@angular/forms';

import { isNullOrUndefined, TextareaResize } from '../../../../internal';

@Component({
  selector: 'pupa-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor, Validator {
  @Input() public resize: TextareaResize = 'horizontal';
  @Input() public maxLength: number | null = null;
  @Input()
  public set valid(newValue: boolean) {
    this.validValue = newValue;
  }
  public get valid(): boolean {
    if (isNullOrUndefined(this.formControl)) {
      return this.validValue;
    }
    return this.formControl.valid;
  }
  @Input()
  public set disabled(newValue: boolean) {
    this.disabledValue = newValue;
  }
  public get disabled(): boolean {
    if (isNullOrUndefined(this.formControl)) {
      return this.disabledValue;
    }
    return this.formControl.disabled;
  }
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  private valueData: string = '';
  @Input() public set value(newValue: string) {
    this.updateValue(newValue);
  }
  public get value(): string {
    if (isNullOrUndefined(this.valueData)) {
      return '';
    }
    return this.valueData;
  }

  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

  public set touched(newValue: boolean) {
    this.touchedValue = newValue;
  }

  public get touched(): boolean {
    if (isNullOrUndefined(this.formControl)) {
      return this.touchedValue;
    }
    return this.formControl.touched;
  }

  private touchedValue: boolean = false;
  private disabledValue: boolean = false;
  private validValue: boolean = false;

  public get formControl(): AbstractControl {
    return !isNullOrUndefined(this.ngControl) ? this.ngControl.control : null;
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef, @Optional() public readonly ngControl: NgControl) {
    if (!isNullOrUndefined(ngControl)) {
      ngControl.valueAccessor = this;
    }
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

  public writeValue(outerValue: string): void {
    this.valueData = outerValue;
    this.changeDetectorRef.detectChanges();
  }

  public updateValue(innerValue: string): void {
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
    this.changeDetectorRef.markForCheck();
  }

  public validate(control: AbstractControl | NgControl): ValidationErrors | null {
    if (!isNullOrUndefined(this.valid)) {
      return this.valid ? null : { manualError: true };
    }
    if (
      isNullOrUndefined(control) ||
      isNullOrUndefined(control.errors) ||
      control.pristine ||
      control.untouched ||
      control.disabled
    ) {
      return null;
    }
    return control.errors;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabledValue = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  public onChange: CallableFunction = (_innerValue: string) => {
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };
}
