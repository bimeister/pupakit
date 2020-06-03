import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DropdownItem } from '../../../../../internal/declarations/interfaces/dropdown-item.interface';

@Component({
  selector: 'pupa-dropdown',
  styleUrls: ['./dropdown.component.scss'],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent<T> {
  @Input() public items: DropdownItem<T>[] | T[];

  /**
   * @description path to visible captionProperty
   * @example captionPropertyPath = 'data.name' // { data: { name: 123 } }
   * @example captionPropertyPath = 'name' // { name: 123 }
   */
  @Input() public captionPropertyPath: string = null;

  @Output() public select: EventEmitter<T> = new EventEmitter<T>();

  public emitSelect(item: T): void {
    this.select.emit(item);
  }
}
