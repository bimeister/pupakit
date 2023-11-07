import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DayPositionInDateRange } from '../../../../declarations/types/day-position-in-date-range.type';

@Component({
  selector: 'pupa-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCellComponent {
  @Input()
  public positionInRange: DayPositionInDateRange | undefined;
}
