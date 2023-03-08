import { DayOfWeek } from '@bimeister/pupakit.calendar';

export interface DaySelectorItem {
  key: DayOfWeek;
  localeName: string;
  isSelected: boolean;
}
