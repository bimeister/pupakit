import { MONTHS_IN_YEAR } from '../constants/months-in-year.const';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../constants/small-calendar-cycle-size-in-years.const';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { getWeeksCountInMonth } from './get-weeks-count-in-month.function';

interface Options {
  labelHeightPx: number;
  weekHeightPx: number;
  dividerHeightPx: number;
  startWeekday: DayOfWeek;
  startYear: number;
}

export function getHeightForEachMonthInCalendarCycle({
  labelHeightPx,
  weekHeightPx,
  dividerHeightPx,
  startWeekday,
  startYear,
}: Options): readonly (readonly number[])[] {
  return Array.from({ length: SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS }, (_: unknown, yearIndex: number) =>
    Array.from(
      { length: MONTHS_IN_YEAR },
      (__: unknown, monthIndex: number) =>
        labelHeightPx +
        dividerHeightPx * 2 +
        getWeeksCountInMonth(yearIndex + startYear, monthIndex + 1, startWeekday) * weekHeightPx
    )
  );
}
