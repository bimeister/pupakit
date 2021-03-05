import { ListRange } from '@angular/cdk/collections';
import { isNil, Nullable } from '@bimeister/utilities';
import { PagedVirtualScrollArguments } from '../interfaces/paged-virtual-scroll-arguments.interface';
import { PagedVirtualScrollArgumentsDto } from './dto/paged-virtual-scroll-arguments.dto';

export class ListRangesIntersectionProducer {
  public static roundToBoundingDozensByCount(
    range: Nullable<ListRange>,
    countItemsInViewport: number,
    totalCount: number
  ): ListRange | undefined {
    const countItemsInViewportIsIncorrect: boolean = isNil(countItemsInViewport) || Number.isNaN(countItemsInViewport);
    if (isNil(range) || countItemsInViewportIsIncorrect) {
      return undefined;
    }

    const { start, end }: ListRange = range;

    if (Number.isNaN(start) || isNil(start) || Number.isNaN(end) || isNil(end)) {
      return undefined;
    }

    const numberRankIndex: number = String(countItemsInViewport).length - 1;
    const roundValue: number = Math.max(numberRankIndex * 10, 10);

    const possibleStart: number = start - countItemsInViewport;
    const roundedStart: number = Math.max(Math.round(possibleStart / roundValue) * roundValue, 0);

    const possibleEnd: number = end + countItemsInViewport;
    const serializedTotalCount: number = totalCount ?? start + countItemsInViewport;
    const roundedEnd: number = Math.min(Math.round(possibleEnd / roundValue) * roundValue, serializedTotalCount);

    return { start: roundedStart, end: roundedEnd };
  }

  public static getPagedVirtualScrollArguments(
    previousRange: ListRange,
    currentRange: ListRange
  ): PagedVirtualScrollArguments {
    const possiblePagedVirtualScrollArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.calculateIntersection(
      previousRange,
      currentRange
    );

    const { getFrom, getTo, removeFrom, removeTo }: PagedVirtualScrollArguments = possiblePagedVirtualScrollArguments;

    const isGettingArgumentsEqual: boolean = !isNil(getFrom) && !isNil(getTo) && getFrom === getTo;
    const isRemovingArgumentsEqual: boolean = !isNil(removeFrom) && !isNil(removeTo) && removeFrom === removeTo;

    const serializedGetFrom: Nullable<number> = isNil(getTo) || isGettingArgumentsEqual ? null : getFrom;
    const serializedGetTo: Nullable<number> = isNil(getFrom) || isGettingArgumentsEqual ? null : getTo;

    const serializedRemoveFrom: Nullable<number> = isNil(removeTo) || isRemovingArgumentsEqual ? null : removeFrom;
    const serializedRemoveTo: Nullable<number> = isNil(removeFrom) || isRemovingArgumentsEqual ? null : removeTo;

    return new PagedVirtualScrollArgumentsDto({
      ...possiblePagedVirtualScrollArguments,
      getFrom: serializedGetFrom,
      getTo: serializedGetTo,
      removeFrom: serializedRemoveFrom,
      removeTo: serializedRemoveTo
    });
  }

  private static calculateIntersection(previousRange: ListRange, currentRange: ListRange): PagedVirtualScrollArguments {
    const serializedCurrentRangeStart: Nullable<number> = currentRange?.start ?? null;
    const serializedCurrentRangeEnd: Nullable<number> = currentRange?.end ?? null;

    const serializedPreviousRangeStart: Nullable<number> = previousRange?.start ?? null;
    const serializedPreviousRangeEnd: Nullable<number> = previousRange?.end ?? null;

    const hasIntersectionOfRanges: boolean = ListRangesIntersectionProducer.hasIntersectionOfRanges(
      previousRange,
      currentRange
    );

    if (isNil(hasIntersectionOfRanges)) {
      return new PagedVirtualScrollArgumentsDto({
        currentFrom: serializedCurrentRangeStart,
        currentTo: serializedCurrentRangeEnd,

        getFrom: serializedCurrentRangeStart,
        getTo: serializedCurrentRangeEnd
      });
    }

    if (!hasIntersectionOfRanges) {
      /** if has no intersection need to remove previous range and get current range */
      return new PagedVirtualScrollArgumentsDto({
        currentFrom: serializedCurrentRangeStart,
        currentTo: serializedCurrentRangeEnd,

        previousFrom: serializedPreviousRangeStart,
        previousTo: serializedPreviousRangeEnd,

        getFrom: serializedCurrentRangeStart,
        getTo: serializedCurrentRangeEnd,

        removeFrom: serializedPreviousRangeStart,
        removeTo: serializedPreviousRangeEnd
      });
    }

    const isNotNilValues: boolean =
      !isNil(serializedCurrentRangeStart) &&
      !isNil(serializedCurrentRangeEnd) &&
      !isNil(serializedPreviousRangeStart) &&
      !isNil(serializedPreviousRangeEnd);
    const isPreviousRangeIncludeCurrent: boolean =
      isNotNilValues &&
      serializedCurrentRangeStart > serializedPreviousRangeStart &&
      serializedCurrentRangeStart < serializedPreviousRangeEnd &&
      serializedCurrentRangeEnd > serializedPreviousRangeStart &&
      serializedCurrentRangeEnd < serializedPreviousRangeEnd;

    if (isPreviousRangeIncludeCurrent) {
      return new PagedVirtualScrollArgumentsDto({
        currentFrom: serializedPreviousRangeStart,
        currentTo: serializedPreviousRangeEnd,

        previousFrom: serializedPreviousRangeStart,
        previousTo: serializedPreviousRangeEnd
      });
    }

    const isCurrentRangeIncludePrevious: boolean =
      isNotNilValues &&
      serializedPreviousRangeStart > serializedCurrentRangeStart &&
      serializedPreviousRangeStart < serializedCurrentRangeEnd &&
      serializedPreviousRangeEnd > serializedCurrentRangeStart &&
      serializedPreviousRangeEnd < serializedCurrentRangeEnd;

    if (isCurrentRangeIncludePrevious) {
      return new PagedVirtualScrollArgumentsDto({
        currentFrom: serializedCurrentRangeStart,
        currentTo: serializedCurrentRangeEnd,

        previousFrom: serializedPreviousRangeStart,
        previousTo: serializedPreviousRangeEnd,

        getFrom: serializedCurrentRangeStart,
        getTo: serializedCurrentRangeEnd
      });
    }

    const intersectionStart: number = Math.max(serializedCurrentRangeStart, serializedPreviousRangeStart);
    const intersectionEnd: number = Math.min(serializedCurrentRangeEnd, serializedPreviousRangeEnd);

    const isIntersectionOnStartOfCurrentRange: boolean =
      intersectionStart === serializedCurrentRangeStart && intersectionEnd <= serializedCurrentRangeEnd;

    if (isIntersectionOnStartOfCurrentRange) {
      /** if has intersection on start of current interval */
      return new PagedVirtualScrollArgumentsDto({
        currentFrom: serializedCurrentRangeStart,
        currentTo: serializedCurrentRangeEnd,

        previousFrom: serializedPreviousRangeStart,
        previousTo: serializedPreviousRangeEnd,

        getFrom: intersectionEnd,
        getTo: serializedCurrentRangeEnd,

        removeFrom: serializedPreviousRangeStart,
        removeTo: intersectionStart
      });
    }

    /** if has intersection on end of current interval */
    return new PagedVirtualScrollArgumentsDto({
      currentFrom: serializedCurrentRangeStart,
      currentTo: serializedCurrentRangeEnd,

      previousFrom: serializedPreviousRangeStart,
      previousTo: serializedPreviousRangeEnd,

      getFrom: serializedCurrentRangeStart,
      getTo: intersectionStart,

      removeFrom: intersectionEnd,
      removeTo: serializedPreviousRangeEnd
    });
  }

  private static hasIntersectionOfRanges(firstInterval: ListRange, secondInterval: ListRange): boolean | undefined {
    if (isNil(firstInterval) || isNil(secondInterval)) {
      return undefined;
    }

    const { start: firstIntervalStart, end: firstIntervalEnd }: ListRange = firstInterval;
    const { start: secondIntervalStart, end: secondIntervalEnd }: ListRange = secondInterval;

    const isNilValuesEntering: boolean =
      isNil(firstIntervalStart) || isNil(firstIntervalEnd) || isNil(secondIntervalStart) || isNil(secondIntervalEnd);
    if (isNilValuesEntering) {
      return undefined;
    }

    const hasIntersection: boolean = firstIntervalStart <= secondIntervalEnd && secondIntervalStart <= firstIntervalEnd;
    return hasIntersection;
  }
}
