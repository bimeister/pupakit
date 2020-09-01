import { isNil } from '@meistersoft/utilities';

export function getRangeEndDate(range: Date[]): Date {
  if (!Array.isArray(range)) {
    return undefined;
  }
  const rangeEndDateIndex: number = range.findIndex(
    (rangeItem: Date, rangeItemIndex: number, rangeItemOrigin: [Date, Date]) => {
      const nextItem: Date = rangeItemOrigin[rangeItemIndex + 1];
      const previousItem: Date = rangeItemOrigin[rangeItemIndex - 1];

      if (isNil(rangeItem)) {
        return false;
      }

      if (isNil(previousItem)) {
        return rangeItem.valueOf() > nextItem.valueOf();
      }
      return rangeItem.valueOf() > previousItem.valueOf();
    }
  );
  if (Object.is(rangeEndDateIndex, -1)) {
    return range[0];
  }
  return range[rangeEndDateIndex];
}
