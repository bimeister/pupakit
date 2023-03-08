import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { getDateFromCalendarDay } from '../../declarations/functions/get-date-from-calendar-day.function';
import { DayOfWeek } from '../../declarations/enums/day-of-week.enum';
import { CalendarDay } from '../../declarations/interfaces/calendar-day.interface';
import { CalendarMonth } from '../../declarations/interfaces/calendar-month.interface';

@Component({
  selector: 'pupa-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthComponent {
  @Input() public calendarMonth: CalendarMonth;
  @Input() public startWeekday: DayOfWeek;
  @Input() public isCurrent: boolean = false;
  @Input() public selectedDates: Date[] = [];

  @Output() public readonly selectDate: EventEmitter<Date> = new EventEmitter<Date>();

  public readonly currentDayNumber: number = new Date().getDate();

  public handleSelectDay(calendarDay: CalendarDay | null): void {
    if (isNil(calendarDay)) {
      return;
    }

    this.selectDate.emit(getDateFromCalendarDay(calendarDay));
  }
}
