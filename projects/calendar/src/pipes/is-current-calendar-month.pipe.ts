import { Pipe, PipeTransform } from '@angular/core';
import { getCurrentCalendarMonth } from '../declarations/functions/get-current-calendar-month.function';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';

@Pipe({
  name: 'isCurrentCalendarMonth',
  pure: true,
})
export class IsCurrentCalendarMonthPipe implements PipeTransform {
  public transform({ year, month }: CalendarMonth): boolean {
    const currentCalendarMonth: CalendarMonth = getCurrentCalendarMonth();

    return month === currentCalendarMonth.month && year === currentCalendarMonth.year;
  }
}
