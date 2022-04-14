import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { DaySelectorSize } from '../../constants/day-selector-size.const';

@Component({
  selector: 'pupa-day-selector-item',
  templateUrl: './day-selector-item.component.html',
  styleUrls: ['./day-selector-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaySelectorItemComponent {
  @Input() public name: string;
  @Input() public size: DaySelectorSize;

  @Input() public selected: boolean = false;
  @Output() public readonly selectedStateChange: EventEmitter<void> = new EventEmitter<void>();

  @Input() public disabled: boolean = false;

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    this.selectedStateChange.next();
  }

  public onKeyDown(event: KeyboardEvent): void {
    const ENTER_EVENT_CODE: string = 'Enter';
    if (this.disabled || event.code !== ENTER_EVENT_CODE) {
      return;
    }
    this.selectedStateChange.next();
  }
}
