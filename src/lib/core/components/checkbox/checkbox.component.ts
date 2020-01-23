import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor {
  @ViewChild('labelElement', { static: true }) public labelElement: ElementRef<HTMLDivElement>;
  @Input() public disabled: boolean = false;
  @Input() public indeterminate: boolean = false;
  @Input()
  public get value(): boolean {
    return this.valueData;
  }
  public set value(newValue: boolean) {
    this.updateValue(newValue);
  }

  @Output() public valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public get resultClassList(): string[] {
    const disabledStateClass: string = this.disabled ? 'checkbox_disabled' : null;
    const hasMarkerClass: string = this.value || this.indeterminate ? 'checkbox_with-marker' : null;
    return [disabledStateClass, hasMarkerClass].filter((innerClassName: string) => !isNullOrUndefined(innerClassName));
  }

  public get isLabelEmpty(): boolean {
    return this.labelElement.nativeElement.innerText.trim().length === 0;
  }

  private valueData: boolean = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  public writeValue(outerValue: unknown): void {
    switch (String(outerValue).toLowerCase()) {
      case 'true': {
        this.valueData = true;
        break;
      }
      default: {
        this.valueData = false;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }

  public changeValue(): void {
    if (this.disabled) {
      return;
    }
    this.indeterminate = false;
    this.updateValue(!this.value);
  }

  public updateValue(innerValue: boolean): void {
    this.valueData = innerValue;
    this.onChange(innerValue);
    this.onTouched();
    this.valueChange.emit(this.value);
  }

  public onChange: CallableFunction = (innerValue: string) => {
    innerValue;
    return;
  };

  public onTouched: VoidFunction = () => {
    return;
  };
}
