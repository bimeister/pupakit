import { CalendarMonth } from '../interfaces/calendar-month.interface';

export function getCurrentCalendarMonth(): CalendarMonth {
  const date: Date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}
