import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '@bimeister/utilities';
import { DAYS_IN_WEEK } from '../declarations/constants/days-in-week.const';
import { DayOfWeek } from '../declarations/enums/day-of-week.enum';
import { getCurrentCalendarDay } from '../declarations/functions/get-current-calendar-day.function';
import { getDaysCountInMonth } from '../declarations/functions/get-days-count-in-month.function';
import { getWeekdayIndex } from '../declarations/functions/get-weekday-index.function';
import { getWeekdayRelativeToNewWeekStart } from '../declarations/functions/get-weekday-relative-to-new-week-start.function';
import { isCalendarDaysEqual } from '../declarations/functions/is-calendar-days-equal.function';
import { isLeapYear } from '../declarations/functions/is-leap-year.function';
import { CalendarDay } from '../declarations/interfaces/calendar-day.interface';
import { CalendarMonth } from '../declarations/interfaces/calendar-month.interface';
import { MonthDayCell } from '../declarations/interfaces/month-day-cell.interface';
import { CalendarConfigService } from '../services/calendar-config.service';

const currentCalendarDay: CalendarDay = getCurrentCalendarDay();

function getMonthCells(daysCount: number, startDay: DayOfWeek, calendarMonth: CalendarMonth): MonthDayCell[][] {
  const weeksCount: number = Math.ceil((daysCount + Number(startDay)) / DAYS_IN_WEEK);

  return Array.from({ length: weeksCount }, (_: unknown, weekIndex: number) =>
    Array.from({ length: DAYS_IN_WEEK }, (__: unknown, weekdayIndex: number) => {
      const dayIndex: number = weekIndex * DAYS_IN_WEEK + weekdayIndex;
      const dayNumber: number = dayIndex + 1;
      const day: number = dayNumber - startDay;

      const isValidDay: boolean = day > 0 && dayNumber <= startDay + daysCount;

      if (!isValidDay) {
        return {
          isEmpty: true,
          index: dayIndex,
          isCurrent: false,
        };
      }

      const calendarDay: CalendarDay = { ...calendarMonth, day };
      const isCurrent: boolean = isCalendarDaysEqual(calendarDay, currentCalendarDay);

      return {
        isEmpty: false,
        index: dayIndex,
        isCurrent,
        calendarDay,
      };
    })
  );
}

@Pipe({
  name: 'monthDayCells',
  pure: true,
})
export class MonthDayCellsPipe implements PipeTransform {
  private readonly startWeekday: DayOfWeek;

  constructor(calendarConfigService: CalendarConfigService) {
    this.startWeekday = calendarConfigService.startWeekday;
  }

  public transform(calendarMonth: CalendarMonth): MonthDayCell[][] {
    if (isEmpty(calendarMonth)) {
      return [];
    }

    const { year, month }: CalendarMonth = calendarMonth;

    const defaultMonthStart: DayOfWeek = getWeekdayIndex(year, month, 1);

    const relativeMonthStart: DayOfWeek = getWeekdayRelativeToNewWeekStart(
      defaultMonthStart,
      DayOfWeek.Sunday,
      this.startWeekday
    );

    const daysCount: number = getDaysCountInMonth(month, isLeapYear(year));

    return getMonthCells(daysCount, relativeMonthStart, calendarMonth);
  }
}
