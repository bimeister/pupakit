import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { DaySelectorSize } from '@kit/lib/components/day-selector/constants/day-selector-size.const';

@Component({
  selector: 'pupa-day-selector-item',
  templateUrl: './day-selector-item.component.html',
  styleUrls: ['./day-selector-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaySelectorItemComponent {
  @Input() public readonly name: string;
  @Input() public size: DaySelectorSize;

  @Input() public selected: boolean = false;
  @Output() public readonly selectedStateChange: EventEmitter<void> = new EventEmitter<void>();

  @Input() public disabled: boolean = false;

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (!this.disabled) this.selectedStateChange.next();
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const ENTER_EVENT_CODE: string = 'Enter';
    if (!this.disabled && event.code === ENTER_EVENT_CODE) this.selectedStateChange.next();
  }
}
