import { DayPositionInDateRange } from '../enums/day-position-in-date-range.enum';
import { CalendarDay } from '../interfaces/calendar-day.interface';
import { getDateFromCalendarDay } from './get-date-from-calendar-day.function';

export function getDayPositionInDateRange(
  calendarDay: CalendarDay,
  selectedDates: Date[]
): DayPositionInDateRange | null {
  if (selectedDates.length !== 2) {
    return null;
  }

  const inputTime: number = getDateFromCalendarDay(calendarDay).getTime();

  const [rangeBegin, rangeEnd]: number[] = selectedDates.map((item: Date) => item.getTime());

  if (inputTime === rangeBegin) {
    return DayPositionInDateRange.First;
  }

  if (inputTime === rangeEnd) {
    return DayPositionInDateRange.Last;
  }

  const isInRange: boolean = inputTime > rangeBegin && inputTime < rangeEnd;

  return isInRange ? DayPositionInDateRange.Inside : null;
}
