import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownItem } from '../dropdown/dropdown.component';
import { cloneDeep, isEqual } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'pupa-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements ControlValueAccessor {
  private _items: DropdownItem<T>[];
  @Input() public set items(v: DropdownItem<T>[]) {
    this._items = v;
    if (!this.selectedItem && v && v.length > 0) {
      this.writeValue(v[0].data);
    }
  }
  public get items(): DropdownItem<T>[] {
    return this._items;
  }
  @Input() public disabled: boolean = false;
  @Input() public positionChange$: Observable<void>;
  @Input() public id: string;
  @Output() public input: EventEmitter<T> = new EventEmitter<T>();
  @Input() public set value(v: T) {
    if (!this.items) {
      return;
    }
    const item: DropdownItem<T> = this.items.find(i => isEqual(i.data, v));
    if (!item) {
      return;
    }
    this.selectedItem = item;
  }

  public get value(): T {
    return this.selectedItem.data;
  }

  public selectedItem: DropdownItem<T>;

  public onChange: (v: T) => void = (v: T) => {
    this.input.emit(v);
  };
  public onTouched: () => void = () => null;

  public writeValue(value: T): void {
    if (!this.items) {
      return;
    }
    const prevValue: DropdownItem<T> = cloneDeep(this.selectedItem);
    const item: DropdownItem<T> = this.items.find((i: DropdownItem<T>) => i.data === value);
    if (!item) {
      return;
    }
    this.selectedItem = item;
    if (!isEqual(prevValue, item)) {
      this.input.emit(item.data);
    }
  }
  public registerOnChange(fn: (v: T) => void): void {
    this.onChange = (v: T): void => {
      this.input.emit(v);
      fn(v);
    };
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
