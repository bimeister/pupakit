import { Pipe, PipeTransform } from '@angular/core';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';

const LAST_MONTH_INDEX: number = 11;

@Pipe({
  name: 'nextCalendarMonth',
  pure: true,
})
export class NextCalendarMonthPipe implements PipeTransform {
  public transform(calendarMonth: CalendarMonth): CalendarMonth {
    return calendarMonth.month >= LAST_MONTH_INDEX
      ? {
          year: Number(calendarMonth.year) + 1,
          month: 0,
        }
      : {
          ...calendarMonth,
          month: Number(calendarMonth.month) + 1,
        };
  }
}
