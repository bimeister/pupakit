import { CalendarDay } from '../interfaces/calendar-day.interface';

export function isCalendarDaysEqual(first: CalendarDay, second: CalendarDay): boolean {
  return first.year === second.year && first.month === second.month && first.day === second.day;
}
