import { CalendarDay } from '../interfaces/calendar-day.interface';

export function getCalendarDayFromDate(date: Date): CalendarDay {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}
