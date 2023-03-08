import { BIG_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../constants/big-calendar-cycle-size-in-years.const';
import { DAYS_IN_WEEK } from '../constants/days-in-week.const';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../constants/small-calendar-cycle-size-in-years.const';
import { SMALL_CALENDAR_CYCLE_WEEKDAYS_SEQUENCE } from '../constants/small-calendar-cycle-weekdays-sequence.const';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { MonthIndex } from '../enums/month-index.enum';
import { isLeapYear } from './is-leap-year.function';

// offset days of the week on the first day of each month for the NORMAL year
const NORMAL_YEAR_OFFSETS_IN_SMALL_CYCLE: number[] = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];

export function getWeekdayIndex(yearNumber: number, monthIndex: MonthIndex, dayNumber: number): DayOfWeek {
  const daysOffset: number = getDaysOffset(yearNumber, monthIndex);

  const yearIndexInSmallCycle: number = getYearIndexInSmallCycle(yearNumber);

  const dayIndex: number = dayNumber - 1;
  const weekdayIndexInSmallCycle: DayOfWeek = SMALL_CALENDAR_CYCLE_WEEKDAYS_SEQUENCE[yearIndexInSmallCycle];

  const weekdayIndex: DayOfWeek = (weekdayIndexInSmallCycle + daysOffset + dayIndex) % DAYS_IN_WEEK;

  return weekdayIndex;
}

function getYearIndexInSmallCycle(yearNumber: number): number {
  const yearIndex: number = yearNumber - 1;

  const yearIndexInBigCycle: number = yearIndex % BIG_CALENDAR_CYCLE_SIZE_IN_YEARS;

  const centuryInBigCycle: number = Math.floor(yearIndexInBigCycle / 100);

  const yearIndexRestoredWithBigCycle: number = 4 * centuryInBigCycle + (yearIndexInBigCycle % 100);

  const yearIndexInSmallCycle: number = yearIndexRestoredWithBigCycle % SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS;

  return yearIndexInSmallCycle;
}

function getDaysOffset(yearNumber: number, monthIndex: MonthIndex): number {
  const offset: number = NORMAL_YEAR_OFFSETS_IN_SMALL_CYCLE[monthIndex];

  const isLeapYearAndFebruaryEnded: boolean = isLeapYear(yearNumber) && monthIndex > MonthIndex.February;

  // increase offset, because february in leap year has 29 days
  return isLeapYearAndFebruaryEnded ? offset + 1 : offset;
}
