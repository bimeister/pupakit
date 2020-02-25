import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from '@angular/core';

import { DropdownItem } from '../../../../../internal/declarations/interfaces/dropdown-item.interface';
import { DroppableComponent } from '../../../droppable/components/droppable/droppable.component';

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

  public emitSelect(item: T): void {
    this.select.emit(item);
    this.toggle(false);
  }
}
