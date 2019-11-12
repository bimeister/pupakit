import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { getPropertyValueByPath } from '../../../helpers/get-property-value-by-path.helper';
import { isNullOrUndefined } from '../../../helpers/is-null-or-undefined.helper';
import { DropdownItem } from '../dropdown/dropdown.component';

@Component({
  selector: 'pupa-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownItemComponent<T> {
  @Input() public item: DropdownItem<T>;

  @Input() public captionPropertyPath: string = null;

  @Output() public select: EventEmitter<DropdownItem<T>> = new EventEmitter<DropdownItem<T>>();

  public onSelect(): void {
    this.emitSelect(this.item);
  }

  public emitSelect(data: DropdownItem<T>): void {
    this.select.emit(data);
  }

  public getCaption(): string {
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
