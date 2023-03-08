import { CalendarDay } from '../interfaces/calendar-day.interface';

export function getDateFromCalendarDay({ year, month, day }: CalendarDay): Date {
  return new Date(year, month, day);
}
