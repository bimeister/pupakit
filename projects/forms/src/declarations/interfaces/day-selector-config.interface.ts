import { DayOfWeek } from '@bimeister/pupakit.calendar';

export interface DaySelectorConfig {
  translates: Record<string, Record<DayOfWeek, string>>;
}
