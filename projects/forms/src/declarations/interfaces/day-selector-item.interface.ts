import { DayOfWeek } from '../enums/day-of-week.enum';

export interface DaySelectorItem {
  key: DayOfWeek;
  localeName: string;
  isSelected: boolean;
}
