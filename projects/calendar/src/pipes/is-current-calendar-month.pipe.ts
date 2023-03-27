import { Pipe, PipeTransform } from '@angular/core';
import { getCurrentCalendarMonth } from '../declarations/functions/get-current-calendar-month.function';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';

const currentCalendarMonth: CalendarMonth = getCurrentCalendarMonth();

@Pipe({
  name: 'isCurrentCalendarMonth',
  pure: true,
})
export class IsCurrentCalendarMonthPipe implements PipeTransform {
  public transform({ year, month }: CalendarMonth): boolean {
    return month === currentCalendarMonth.month && year === currentCalendarMonth.year;
  }
}
