import { DayOfWeek } from '../enums/day-of-week.enum';
import { DaySelectorConfig } from '../interfaces/day-selector-config.interface';

export const DEFAULT_DAY_SELECTOR_CONFIG: DaySelectorConfig = {
  translates: {
    en: {
      [DayOfWeek.Monday]: 'Mo',
      [DayOfWeek.Tuesday]: 'Tu',
      [DayOfWeek.Wednesday]: 'We',
      [DayOfWeek.Thursday]: 'Th',
      [DayOfWeek.Friday]: 'Fr',
      [DayOfWeek.Saturday]: 'Sa',
      [DayOfWeek.Sunday]: 'Su',
    },
  },
};
