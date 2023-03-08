import { Pipe, PipeTransform } from '@angular/core';
import { DayOfWeek } from '../declarations/enums/day-of-week.enum';
import { DayPositionInDateRange } from '../declarations/enums/day-position-in-date-range.enum';
import { getDayPositionInDateRange } from '../declarations/functions/get-day-position-in-date-range.function';
import { getDaysCountInMonth } from '../declarations/functions/get-days-count-in-month.function';
import { getWeekdayIndex } from '../declarations/functions/get-weekday-index.function';
import { getWeekdayRelativeToNewWeekStart } from '../declarations/functions/get-weekday-relative-to-new-week-start.function';
import { isLeapYear } from '../declarations/functions/is-leap-year.function';
import { CalendarDay } from '../declarations/interfaces/calendar-day.interface';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';
import { CalendarConfigService } from '../services/calendar-config.service';

@Pipe({
  name: 'isEmptyDayInDateRange',
  pure: true,
})
export class IsEmptyDayInDateRangePipe implements PipeTransform {
  private readonly startWeekday: DayOfWeek;

  constructor(calendarConfigService: CalendarConfigService) {
    this.startWeekday = calendarConfigService.startWeekday;
  }

  public transform(dayIndex: number, calendarMonth: CalendarMonth, selectedDates: Date[]): boolean {
    const { year, month }: CalendarMonth = calendarMonth;

    if (selectedDates.length !== 2) {
      return false;
    }

    const defaultMonthStart: DayOfWeek = getWeekdayIndex(year, month, 1);
    const relativeMonthStart: DayOfWeek = getWeekdayRelativeToNewWeekStart(
      defaultMonthStart,
      DayOfWeek.Sunday,
      this.startWeekday
    );

    const isEmptyAtBegin: boolean = dayIndex < relativeMonthStart;
    const firstMonthDay: CalendarDay = { year, month, day: 1 };
    const firstMonthDayPosition: DayPositionInDateRange = getDayPositionInDateRange(firstMonthDay, selectedDates);
    const firstMonthDayIsNotFirst: boolean = [DayPositionInDateRange.Last, DayPositionInDateRange.Inside].includes(
      firstMonthDayPosition
    );

    if (isEmptyAtBegin && firstMonthDayIsNotFirst) {
      return true;
    }

    const daysCount: number = getDaysCountInMonth(month, isLeapYear(year));
    const isEmptyAtEnd: boolean = dayIndex >= Number(relativeMonthStart) + Number(daysCount);
    const lastMonthDay: CalendarDay = { year, month, day: daysCount };
    const lastMonthDayPosition: DayPositionInDateRange = getDayPositionInDateRange(lastMonthDay, selectedDates);
    const lastMonthDayIsNotLast: boolean = [DayPositionInDateRange.First, DayPositionInDateRange.Inside].includes(
      lastMonthDayPosition
    );

    if (isEmptyAtEnd && lastMonthDayIsNotLast) {
      return true;
    }

    return false;
  }
}
