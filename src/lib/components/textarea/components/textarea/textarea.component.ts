import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors, Validator } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';

import { TextareaResize } from '../../../../../internal/declarations/types/textarea-resize.type';

@Component({
  selector: 'pupa-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor, Validator, AfterViewInit {
  @ViewChild(CdkTextareaAutosize) public readonly autosizeDirective: CdkTextareaAutosize;

  @Input() public autosize: boolean = false;
  @Input() public resize: TextareaResize = 'horizontal';
  @Input() public maxLength: number | null = null;
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
  @Input() public placeholder: string = '';
  @Input() public id: string;
  @Input() public name: string;
  private valueData: string = '';
  @Input() public set value(newValue: string) {
    this.updateValue(newValue);
  }
  public get value(): string {
    if (isNil(this.valueData)) {
      return '';
    }
    return this.valueData;
  }

  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

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

  public ngAfterViewInit(): void {
    this.autosizeDirective.enabled = this.autosize;
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
}
