import { DAYS_IN_WEEK } from '../constants/days-in-week.const';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { getWeekdayRelativeToNewWeekStart } from './get-weekday-relative-to-new-week-start.function';

export function getWeeksCountInMonth(yearNumber: number, monthNumber: number, startWeekday: DayOfWeek): number {
  const monthIndex: number = monthNumber - 1;

  const startDate: Date = new Date(yearNumber, monthIndex, 1);
  const endDate: Date = new Date(yearNumber, monthIndex + 1, 0);

  const startMonthWeekday: DayOfWeek = getWeekdayRelativeToNewWeekStart(
    startDate.getDay(),
    DayOfWeek.Sunday,
    startWeekday
  );

  const daysInMonth: number = endDate.getDate() - startDate.getDate() + 1;

  const wholeWeeksCount: number = Math.floor(daysInMonth / DAYS_IN_WEEK);

  const daysAtFirstPartialWeek: number = DAYS_IN_WEEK - startMonthWeekday;

  if (!isPartialWeek(daysAtFirstPartialWeek)) {
    const daysAtLastPartialWeek: number = daysInMonth % DAYS_IN_WEEK;

    return wholeWeeksCount + (isPartialWeek(daysAtLastPartialWeek) ? 1 : 0);
  }

  const daysAtLastPartialWeek: number = (daysInMonth % DAYS_IN_WEEK) - daysAtFirstPartialWeek;

  return wholeWeeksCount + 1 + (isPartialWeek(daysAtLastPartialWeek) ? 1 : 0);
}

function isPartialWeek(daysCount: number): boolean {
  return daysCount > 0 && daysCount < DAYS_IN_WEEK;
}
