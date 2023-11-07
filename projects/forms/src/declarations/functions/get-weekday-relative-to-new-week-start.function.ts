import { DAYS_IN_WEEK } from '../constants/days-in-week.const';
import { DayOfWeek } from '../enums/day-of-week.enum';

export function getWeekdayRelativeToNewWeekStart(
  weekday: DayOfWeek,
  oldWeekStart: DayOfWeek,
  newWeekStart: DayOfWeek
): DayOfWeek {
  const delta: number = oldWeekStart - newWeekStart;

  const newWeekdayPosition: number = weekday + delta;

  if (newWeekdayPosition >= DAYS_IN_WEEK) {
    return newWeekdayPosition % DAYS_IN_WEEK;
  }

  if (newWeekdayPosition < 0) {
    return newWeekdayPosition + DAYS_IN_WEEK;
  }

  return newWeekdayPosition;
}
