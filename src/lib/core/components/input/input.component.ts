import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export type InputSize = 'medium' | 'small';
export type InputValid = true | false | null;
@Component({
  selector: 'pupa-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @Input() public type: string = 'text';
  @Input() public size: InputSize = 'medium';
  @Input() public valid: InputValid = null;
  @Input() public disabled: boolean = false;
  @Input() public placeholder: string = '';
  @Input()
  public get value(): string {
    return this.valueData;
  }
  public set value(newValue: string) {
    this.updateValue(newValue);
  }

  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

  public get resultClassList(): string[] {
    return [this.size, this.getValidationStateClass()]
      .filter((innerClassName: string) => !isNullOrUndefined(innerClassName))
      .map((innerProperty: string) => `input_${innerProperty}`);
  }

  private valueData: string = '';

  public registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  public writeValue(outerValue: unknown): void {
    this.valueData = String(outerValue);
  }

  public updateValue(innerValue: string): void {
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  private getValidationStateClass(): string {
    switch (this.valid) {
      case true: {
        return 'valid';
      }
      case false: {
        return 'invalid';
      }
      default:
        return null;
    }
  }

  public onChange: CallableFunction = (innerValue: string) => {
    innerValue;
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };
}
