import { isDate } from './is-date.helper';
import { isNullOrUndefined } from './is-null-or-undefined.helper';

export function dateClearTime(date: Date): Date {
  if (isNullOrUndefined(date) || isDate(date)) {
    return date;
  }
  const sanitizedDate: Date = date;
  sanitizedDate.setHours(0, 0, 0, 0);
  return sanitizedDate;
}
