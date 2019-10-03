import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from '@angular/core';

import { DroppableComponent } from '../droppable/droppable.component';

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
  @Input() public items: DropdownItem<T>[];

  @Output() public select: EventEmitter<T> = new EventEmitter<T>();

  constructor(protected readonly cDRef: ChangeDetectorRef, protected readonly renderer: Renderer2) {
    super(cDRef, renderer);
  }

  public onSelect(item: DropdownItem<T>): void {
    this.select.emit(item.data);
    this.toggle(false);
  }
}
