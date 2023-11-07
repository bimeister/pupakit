import { DayOfWeek } from '../../declarations/enums/day-of-week.enum';

export interface DaySelectorConfig {
  translates: Record<string, Record<DayOfWeek, string>>;
}
