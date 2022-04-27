import { DaySelectorConfig } from '../declarations/interfaces/day-selector-config.interface';
import { DayOfWeek } from '../declarations/enums/day-of-week.enum';

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
