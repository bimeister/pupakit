import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getRangeEndDate } from 'src/lib/helpers/get-range-end-date.helper';
import { getRangeStartDate } from 'src/lib/helpers/get-range-start-date.helper';
import { isDate } from 'src/lib/helpers/is-date.helper';

export type InputSize = 'medium' | 'small';
export type InputType = 'password' | 'text' | 'date' | 'date-range';
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
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('inputElement', { static: false }) public inputElement: ElementRef<HTMLInputElement>;
  @Input() public showValidateIcon: boolean = false;
  @Input() public type: InputType = 'text';
  @Input() public size: InputSize = 'medium';
  @Input() public valid: boolean = null;
  @Input() public disabled: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  @Input() public width: string;
  @Input()
  public get value(): unknown {
    return this.valueData;
  }
  public set value(newValue: unknown) {
    this.updateValue(newValue);
  }

  @Output() public valueChange: EventEmitter<unknown> = new EventEmitter<unknown>();

  public touched: boolean = false;

  public isDatePickerVisible: boolean = false;

  private valueData: unknown = null;

  constructor(protected readonly renderer: Renderer2) {}

  public get isDateInput(): boolean {
    return this.type.toLowerCase() === 'date' || this.type.toLowerCase() === 'date-range';
  }

  public ngAfterViewInit(): void {
    if (this.width) {
      this.renderer.setStyle(this.inputElement.nativeElement, 'width', `${this.width}`);
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
      this.touched = true;
    };
  }

  public writeValue(outerValue: unknown): void {
    this.valueData = String(outerValue);
  }

  public updateValue(innerValue: unknown): void {
    this.isDatePickerVisible = false;
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
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
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeStartDate(value);
  };

  public readonly getRangeEnd = (value: unknown): Date => {
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeEndDate(value);
  };
}
