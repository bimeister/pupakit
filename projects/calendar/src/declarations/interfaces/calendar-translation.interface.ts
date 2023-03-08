import { CalendarTextKey } from '../enums/calendar-text-key.enum';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { MonthIndex } from '../enums/month-index.enum';

export interface CalendarTranslation {
  texts: Record<CalendarTextKey, string>;
  weekdays: Record<DayOfWeek, string>;
  months: Record<MonthIndex, string>;
}
