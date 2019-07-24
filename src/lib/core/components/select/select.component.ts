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
  @Output() public input: EventEmitter<T> = new EventEmitter<T>();

  public get value(): T {
    return this.selectedItem.data;
  }

  public selectedItem: DropdownItem<T>;

  public onChange: any;
  public onTouched: any;

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
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
