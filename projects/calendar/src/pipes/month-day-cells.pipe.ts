import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '@bimeister/utilities';
import { DAYS_IN_WEEK } from '../declarations/constants/days-in-week.const';
import { DayOfWeek } from '../declarations/enums/day-of-week.enum';
import { getDaysCountInMonth } from '../declarations/functions/get-days-count-in-month.function';
import { getWeekdayIndex } from '../declarations/functions/get-weekday-index.function';
import { getWeekdayRelativeToNewWeekStart } from '../declarations/functions/get-weekday-relative-to-new-week-start.function';
import { isLeapYear } from '../declarations/functions/is-leap-year.function';
import { CalendarDay } from '../declarations/interfaces/calendar-day.interface';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';

function getMonthCells(daysCount: number, startDay: DayOfWeek, calendarMonth: CalendarMonth): (CalendarDay | null)[] {
  const cellsCount: number = Math.ceil((daysCount + Number(startDay)) / DAYS_IN_WEEK) * DAYS_IN_WEEK;

  return Array.from({ length: cellsCount }, (_: unknown, dayIndex: number) => {
    const dayNumber: number = dayIndex + 1;

    const day: number = dayIndex + 1 - startDay;

    if (day <= 0 || dayNumber > Number(startDay) + daysCount) {
      return null;
    }

    return {
      ...calendarMonth,
      day,
    };
  });
}

@Pipe({
  name: 'monthDayCells',
  pure: true,
})
export class MonthDayCellsPipe implements PipeTransform {
  public transform(calendarMonth: CalendarMonth, weekStart: DayOfWeek): (CalendarDay | null)[] {
    if (isEmpty(calendarMonth)) {
      return [];
    }

    const { year, month }: CalendarMonth = calendarMonth;

    const defaultMonthStart: DayOfWeek = getWeekdayIndex(year, month, 1);

    const relativeMonthStart: DayOfWeek = getWeekdayRelativeToNewWeekStart(
      defaultMonthStart,
      DayOfWeek.Sunday,
      weekStart
    );

    const daysCount: number = getDaysCountInMonth(month, isLeapYear(year));

    return getMonthCells(daysCount, relativeMonthStart, calendarMonth);
  }
}
