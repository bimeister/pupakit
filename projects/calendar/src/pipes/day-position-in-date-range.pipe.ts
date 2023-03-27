import { Pipe, PipeTransform } from '@angular/core';
import { getDayPositionInDateRange } from '../declarations/functions/get-day-position-in-date-range.function';
import { CalendarDay } from '../declarations/interfaces/calendar-day.interface';
import { DayPositionInDateRange } from '../declarations/types/day-position-in-date-range.type';

@Pipe({
  name: 'dayPositionInDateRange',
  pure: true,
})
export class DayPositionInDateRangePipe implements PipeTransform {
  public transform(calendarDay: CalendarDay, selectedDates: Date[]): DayPositionInDateRange | null {
    return getDayPositionInDateRange(calendarDay, selectedDates);
  }
}
