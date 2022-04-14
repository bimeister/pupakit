import { DayOfWeek } from '../types/day-of-week';

export interface DaySelectorItem {
  key: DayOfWeek;
  localeName: string;
  isSelected: boolean;
}
