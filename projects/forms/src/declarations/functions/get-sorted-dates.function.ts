import { SortDirection } from '@bimeister/utilities';

export function getSortedDates(dates: Date[], sortDirection: SortDirection): Date[] {
  const compareFn = (first: number, second: number): number =>
    sortDirection === 'ascending' ? first - second : second - first;

  return [...dates].sort((first: Date, second: Date) => compareFn(first.getTime(), second.getTime()));
}
