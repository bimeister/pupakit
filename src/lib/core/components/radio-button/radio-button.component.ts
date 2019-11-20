import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Provider
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioButtonComponent),
  multi: true
};

type VoidFn = () => void;
type ChangeFn<T> = (value: T) => void;

@Component({
  selector: 'pupa-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ACCESSOR]
})
export class RadioButtonComponent<T> implements ControlValueAccessor {
  @Input() public name: string;
  @Input() public id: string;
  @Input() public value: T;
  @Output() public change: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  private checkedData: boolean = false;
  @Input()
  public set checked(value: boolean) {
    const change: boolean = this.checked !== value;
    this.checkedData = value;
    if (change) {
      this.change.emit(value);
    }
    this.changeDetectorRef.markForCheck();
  }
  public get checked(): boolean {
    return this.checkedData;
  }
  public onChange: ChangeFn<boolean> = (_: boolean): void => null;
  public onTouched: VoidFn = (): void => null;

  public registerOnChange(fn: ChangeFn<boolean>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: VoidFn): void {
    this.onTouched = fn;
  }

  public writeValue(value: boolean): void {
    this.checked = value;
  }
}
