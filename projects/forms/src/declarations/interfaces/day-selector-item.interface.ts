import { DayOfWeek } from '../../declarations/enums/day-of-week.enum';

export interface DaySelectorItem {
  key: DayOfWeek;
  localeName: string;
  isSelected: boolean;
}
