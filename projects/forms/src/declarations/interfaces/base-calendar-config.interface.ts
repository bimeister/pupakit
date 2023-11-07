import { DayOfWeek } from '../enums/day-of-week.enum';
import { CalendarTranslation } from './calendar-translation.interface';

export interface BaseCalendarConfig {
  readonly startWeekday: DayOfWeek;
  readonly yearsRange: number;
  readonly translations: Record<string, CalendarTranslation>;
}
