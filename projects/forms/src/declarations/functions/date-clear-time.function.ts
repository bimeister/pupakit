import { isNil } from '@bimeister/utilities';
import { isDate } from './is-date.function';

export function dateClearTime(date: Date): Date {
  if (isNil(date) || !isDate(date)) {
    return date;
  }
  const sanitizedDate: Date = date;
  sanitizedDate.setHours(0, 0, 0, 0);
  return sanitizedDate;
}
