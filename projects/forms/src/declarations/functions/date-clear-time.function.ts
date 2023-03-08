import { isDate } from '@bimeister/pupakit.calendar';
import { isNil } from '@bimeister/utilities';

export function dateClearTime(date: Date): Date {
  if (isNil(date) || !isDate(date)) {
    return date;
  }

  const sanitizedDate: Date = date;
  sanitizedDate.setHours(0, 0, 0, 0);
  return sanitizedDate;
}
