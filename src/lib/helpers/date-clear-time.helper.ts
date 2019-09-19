import { isNullOrUndefined } from './is-null-or-undefined.helper';

export const dateClearTime = (date: Date): Date => {
  if (isNullOrUndefined(date)) {
    return date;
  }
  const sanitizedDate: Date = date;
  sanitizedDate.setHours(0, 0, 0, 0);
  return sanitizedDate;
};
