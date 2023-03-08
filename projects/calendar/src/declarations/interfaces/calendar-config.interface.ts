import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { DayOfWeek } from '../enums/day-of-week.enum';

export interface CalendarConfig {
  readonly startWeekday: DayOfWeek;
  readonly startYear: number;
  readonly yearsRange: number;
  readonly translations: Record<string, CalendarTranslation>;
}
