import { CalendarDay } from '../interfaces/calendar-day.interface';

export function getCurrentCalendarDay(): CalendarDay {
  const date: Date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}
