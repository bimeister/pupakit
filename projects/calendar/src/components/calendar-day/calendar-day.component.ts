import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DayPositionInDateRange } from '../../declarations/enums/day-position-in-date-range.enum';

@Component({
  selector: 'pupa-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent {
  @Input() public value: number | null = null;

  @Input() public isDisabled: boolean = false;

  @Input() public isEmpty: boolean = false;

  @Input() public isCurrent: boolean = false;

  @Input() public positionInRange: DayPositionInDateRange | null = null;

  @Input() public isSelected: boolean = false;

  @Input() public isRangeEmptySpace: boolean = false;

  @Output() public readonly select: EventEmitter<void> = new EventEmitter<void>();

  public handleClick(): void {
    this.select.emit();
  }
}
