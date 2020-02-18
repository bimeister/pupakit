import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { getPropertyValueByPath } from '../../../../internal/helpers/get-property-value-by-path.helper';
import { isNullOrUndefined } from '../../../../internal/helpers/is-null-or-undefined.helper';
import { DropdownItem } from '../dropdown/dropdown.component';

@Component({
  selector: 'pupa-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownItemComponent<T> {
  @Input() public item: DropdownItem<T> | T;

  @Input() public captionPropertyPath: string = null;

  @Output() public select: EventEmitter<T> = new EventEmitter<T>();

  public onSelect(): void {
    this.emitSelect(this.item);
  }

  public emitSelect(item: DropdownItem<T> | T): void {
    this.select.emit(
      isNullOrUndefined(this.captionPropertyPath) && (item as DropdownItem<T>).data
        ? (item as DropdownItem<T>).data
        : (item as T)
    );
  }

  public get itemData(): DropdownItem<T> {
    return this.item as DropdownItem<T>;
  }

  public get getCaption(): string {
    if (isNullOrUndefined(this.item)) {
      return null;
    }
    if (isNullOrUndefined(this.captionPropertyPath) && this.item.hasOwnProperty('caption')) {
      return this.item['caption'];
    }
    if (!isNullOrUndefined(this.captionPropertyPath)) {
      const extractedCaption: unknown = getPropertyValueByPath(this.item, this.captionPropertyPath);
      return String(extractedCaption);
    }
    return null;
  }
}
