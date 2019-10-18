import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from '@angular/core';

import { getPropertyValueByPath } from './../../../helpers/get-property-value-by-path.helper';
import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { DroppableComponent } from './../droppable/droppable.component';

export interface IconData {
  name?: string;
  src?: string;
  color?: string;
}

export interface DropdownItem<T> {
  caption: string;
  iconLeft?: IconData;
  iconRight?: IconData;
  data: T;
}

@Component({
  selector: 'pupa-dropdown',
  styleUrls: ['./dropdown.component.scss'],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent<T> extends DroppableComponent {
  @Input() public items: DropdownItem<T>[] | T[];

  /**
   * @description path to visible captionProperty
   * @example captionPropertyPath = 'data.name' // { data: { name: 123 } }
   * @example captionPropertyPath = 'name' // { name: 123 }
   */
  @Input() public captionPropertyPath: string = null;

  @Output() public select: EventEmitter<T> = new EventEmitter<T>();

  constructor(protected readonly cDRef: ChangeDetectorRef, protected readonly renderer: Renderer2) {
    super(cDRef, renderer);
  }

  public onSelect(item: DropdownItem<T> | T): void {
    this.select.emit(isNullOrUndefined(this.captionPropertyPath) ? (item as DropdownItem<T>).data : (item as T));
    this.toggle(false);
  }

  public getCaption(item: T): string {
    if (isNullOrUndefined(this.captionPropertyPath) && item.hasOwnProperty('caption')) {
      return item['caption'];
    }
    if (!isNullOrUndefined(this.captionPropertyPath)) {
      const extractedCaption: unknown = getPropertyValueByPath(item, this.captionPropertyPath);
      return String(extractedCaption);
    }
    return null;
  }
}
