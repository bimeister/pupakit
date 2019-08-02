import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pupa-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitcherComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitcherComponent implements ControlValueAccessor {
  @Input() public indifferent: boolean = false;
  @Input() public id: string;
  @Input() public disabled: boolean;
  @Output() public change: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _value: boolean = false;
  get value(): boolean {
    return this._value;
  }

  @Input() set value(v: boolean) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
      this.change.emit(v);
    }
  }

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public onChange: (v: boolean) => void = (v: boolean) => { this.change.emit(v); };
  public onTouched: () => void  = () => undefined;

  public writeValue(value: boolean): void {
    if ((value as any) instanceof Event) {
      return;
    }
    this.cdRef.markForCheck();
    this._value = value;
  }

  public toggle(): void {
    if (this.disabled) {
      return;
    }
    this.value = !this.value;
  }

  public registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = (v: boolean): void => {
      this.change.emit(v);
      fn(v);
    };
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
