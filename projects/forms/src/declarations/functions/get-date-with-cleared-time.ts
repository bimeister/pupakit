import { getClearDate } from './get-clear-date.function';

export function getDateWithClearedTime(date: Date): Date {
  const clearDate: Date = getClearDate();

  clearDate.setFullYear(date.getFullYear());
  clearDate.setMonth(date.getMonth());
  clearDate.setDate(date.getDate());

  return clearDate;
}
