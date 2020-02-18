import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cloneDeep, isEqual } from 'lodash';
import { Observable } from 'rxjs';

import { getPropertyValueByPath, isNullOrUndefined } from '../../../../internal';
import { DropdownItem } from '../../../dropdown/components/dropdown/dropdown.component';

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
  private _value: T;

  public selectedItem: DropdownItem<T> | T;

  public itemsCollection: Set<DropdownItem<T> | T> = new Set<DropdownItem<T> | T>([]);

  @Input() public set items(v: DropdownItem<T>[]) {
    this._items = v;
    this.updateCollection();
    if (!this.value && v && v.length > 0) {
      this.writeValue(v[0].data);
    } else {
      this.writeValue(this.value);
    }
  }
  public get items(): DropdownItem<T>[] {
    return this._items;
  }

  @Input() public disabled: boolean = false;

  @Input() public positionChange$: Observable<void>;

  @Input() public id: string;

  /**
   * @description path to visible captionProperty
   * @example captionPropertyPath = 'data.name' // { data: { name: 123 } }
   * @example captionPropertyPath = 'name' // { name: 123 }
   */
  @Input() public captionPropertyPath: string = null;

  @Output() public input: EventEmitter<T> = new EventEmitter<T>();

  @Input() public set value(v: T) {
    this._value = v;
    this.writeValue(v);
  }
  public get value(): T {
    return this._value;
  }

  public writeValue(value: T): void {
    if (!this.items) {
      return;
    }
    const prevValue: DropdownItem<T> | T = cloneDeep(this.selectedItem);
    const item: DropdownItem<T> | T = Array.from(this.itemsCollection.values()).find((i: DropdownItem<T> | T) => {
      if (isNullOrUndefined(this.captionPropertyPath)) {
        return (i as DropdownItem<T>).data === value;
      }
      if (!isNullOrUndefined(this.captionPropertyPath)) {
        return this.getCaption(i as T) === this.getCaption(value);
      }
      return false;
    });
    if (!item) {
      return;
    }
    this.selectedItem = item;
    if (!isEqual(prevValue, item)) {
      this.onChange(value);
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

  public getCaption(item: T): string {
    if (isNullOrUndefined(item)) {
      return null;
    }
    if (isNullOrUndefined(this.captionPropertyPath) && item.hasOwnProperty('caption')) {
      return item['caption'];
    }
    if (!isNullOrUndefined(this.captionPropertyPath)) {
      const extractedCaption: unknown = getPropertyValueByPath(item, this.captionPropertyPath);

      return String(extractedCaption);
    }
    return null;
  }

  public onChange: (v: T) => void = (v: T) => {
    this.input.emit(v);
  };

  public onTouched: () => void = () => null;

  private updateCollection(): void {
    this.itemsCollection.clear();
    if (isNullOrUndefined(this._items)) {
      return;
    }
    this._items.forEach((item: DropdownItem<T>) => {
      this.parseItem(item);
    });
  }

  private parseItem(item: DropdownItem<T>): void {
    this.itemsCollection.add(item);
    if (item.children) {
      item.children.forEach((child: DropdownItem<T>) => {
        this.parseItem(child);
      });
    }
  }
}
