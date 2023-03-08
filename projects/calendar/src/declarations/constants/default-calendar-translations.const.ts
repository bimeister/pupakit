import { CalendarTextKey } from '../enums/calendar-text-key.enum';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { MonthIndex } from '../enums/month-index.enum';
import { CalendarTranslation } from '../interfaces/calendar-translation.interface';

export const DEFAULT_CALENDAR_TRANSLATIONS: Record<string, CalendarTranslation> = {
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
};
