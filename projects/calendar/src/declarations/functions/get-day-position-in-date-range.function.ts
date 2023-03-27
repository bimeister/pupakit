import { CalendarDay } from '../interfaces/calendar-day.interface';
import { DayPositionInDateRange } from '../types/day-position-in-date-range.type';
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
    return 'first';
  }

  if (inputTime === rangeEnd) {
    return 'last';
  }

  const isInRange: boolean = inputTime > rangeBegin && inputTime < rangeEnd;

  return isInRange ? 'inside' : null;
}
