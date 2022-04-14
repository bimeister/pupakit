import { DayOfWeek } from '@kit/lib/components/day-selector/types/day-of-week';

export interface DaySelectorConfig {
  translates: Record<string, Record<DayOfWeek, string>>;
}
