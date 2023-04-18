import { CalendarTextKey } from '../enums/calendar-text-key.enum';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { MonthIndex } from '../enums/month-index.enum';
import { BaseCalendarConfig } from '../interfaces/base-calendar-config.interface';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from './small-calendar-cycle-size-in-years.const';

export const DEFAULT_CALENDAR_CONFIG: BaseCalendarConfig = {
  startWeekday: DayOfWeek.Monday,
  yearsRange: SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS * 7,
  translations: {
    en: {
      weekdays: {
        [DayOfWeek.Sunday]: 'Su',
        [DayOfWeek.Monday]: 'Mo',
        [DayOfWeek.Tuesday]: 'Tu',
        [DayOfWeek.Wednesday]: 'We',
        [DayOfWeek.Thursday]: 'Th',
        [DayOfWeek.Friday]: 'Fr',
        [DayOfWeek.Saturday]: 'Sa',
      },
      months: {
        [MonthIndex.January]: 'January',
        [MonthIndex.February]: 'February',
        [MonthIndex.March]: 'March',
        [MonthIndex.April]: 'April',
        [MonthIndex.May]: 'May',
        [MonthIndex.June]: 'June',
        [MonthIndex.July]: 'July',
        [MonthIndex.August]: 'August',
        [MonthIndex.September]: 'September',
        [MonthIndex.October]: 'October',
        [MonthIndex.November]: 'November',
        [MonthIndex.December]: 'December',
      },
      texts: {
        [CalendarTextKey.SelectYear]: 'Select year',
        [CalendarTextKey.SelectMonth]: 'Select month',
      },
    },
  },
};
