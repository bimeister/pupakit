import { MonthIndex } from '../enums/month-index.enum';

export function getDaysCountInMonth(monthIndex: MonthIndex | number, isLeapYear: boolean): number {
  switch (monthIndex) {
    case MonthIndex.February:
      return isLeapYear ? 29 : 28;
    case MonthIndex.April:
    case MonthIndex.June:
    case MonthIndex.September:
    case MonthIndex.November:
      return 30;
    default:
      return 31;
  }
}
