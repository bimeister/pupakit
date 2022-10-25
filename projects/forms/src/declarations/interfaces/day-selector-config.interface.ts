import { DayOfWeek } from '../enums/day-of-week.enum';

export interface DaySelectorConfig {
  translates: Record<string, Record<DayOfWeek, string>>;
}
