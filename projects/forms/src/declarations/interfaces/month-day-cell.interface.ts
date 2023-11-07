import { CalendarDay } from './calendar-day.interface';

export interface MonthDayCell {
  isEmpty: boolean;
  index: number;
  isCurrent: boolean;
  calendarDay?: CalendarDay;
}
