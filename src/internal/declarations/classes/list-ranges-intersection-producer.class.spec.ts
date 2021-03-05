import { ListRange } from '@angular/cdk/collections';
import { PagedVirtualScrollArguments } from '../interfaces/paged-virtual-scroll-arguments.interface';
import { ListRangesIntersectionProducer } from './list-ranges-intersection-producer.class';

describe('list-ranges-intersection-producer.class.ts', () => {
  describe('ListRangesIntersectionProducer.getPagedVirtualScrollArguments', () => {
    const previousStart: number = Math.floor(Math.random() * (50 - 20)) + 20; // random number from [20, 50)
    const previousEnd: number = Math.floor(Math.random() * (80 - 60)) + 50; // random number from [60, 80)

    const previousRange: ListRange = { start: previousStart, end: previousEnd }; // interval [20, 80)

    const currentRangeStartInPreviousRange: number =
      Math.floor(Math.random() * (previousEnd - previousStart - 2)) + previousStart + 1; // interval (20, 80)
    const currentRangeEndInPreviousRange: number =
      Math.floor(Math.random() * (previousEnd - currentRangeStartInPreviousRange - 2)) +
      currentRangeStartInPreviousRange +
      1;

    const currentRangeStartNotInPreviousRange: number = Math.floor(Math.random() * (10 - 5)) + 5;
    const currentRangeEndNotInPreviousRange: number = Math.floor(Math.random() * (120 - 90)) + 90;

    const currentRangeThatIntersectedRight: ListRange = {
      start: currentRangeStartInPreviousRange,
      end: currentRangeEndNotInPreviousRange
    };

    const currentRangeThatIntersectedLeft: ListRange = {
      start: currentRangeStartNotInPreviousRange,
      end: currentRangeEndInPreviousRange
    };

    const currentRangeThatIntersectedRightBound: ListRange = {
      start: previousEnd,
      end: currentRangeEndNotInPreviousRange
    };

    const currentRangeThatIntersectedLeftBound: ListRange = {
      start: currentRangeStartNotInPreviousRange,
      end: previousStart
    };

    const currentRangeThatIncludingPreviousWithEqualLeftBound: ListRange = {
      start: previousRange.start,
      end: currentRangeEndNotInPreviousRange
    };

    const currentRangeThatIncludingPreviousWithEqualRightBound: ListRange = {
      start: currentRangeStartNotInPreviousRange,
      end: previousRange.end
    };

    const currentRangeNotIntersectedPreviousRight: ListRange = {
      start: currentRangeEndNotInPreviousRange,
      end: currentRangeEndNotInPreviousRange + 20
    };

    const currentRangeNotIntersectedPreviousLeft: ListRange = {
      start: 2,
      end: currentRangeStartNotInPreviousRange
    };

    const currentRangeThatIncludedInPrevious: ListRange = {
      start: currentRangeStartInPreviousRange,
      end: currentRangeEndInPreviousRange
    };

    const currentRangeThatContainsPrevious: ListRange = {
      start: currentRangeStartNotInPreviousRange,
      end: currentRangeEndNotInPreviousRange
    };

    it('current range intersected right: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIntersectedRight
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedRight.start,
        currentTo: currentRangeThatIntersectedRight.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: previousRange.end,
        getTo: currentRangeThatIntersectedRight.end,

        removeFrom: previousRange.start,
        removeTo: currentRangeThatIntersectedRight.start
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range intersected left: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIntersectedLeft
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedLeft.start,
        currentTo: currentRangeThatIntersectedLeft.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeThatIntersectedLeft.start,
        getTo: previousRange.start,

        removeFrom: currentRangeThatIntersectedLeft.end,
        removeTo: previousRange.end
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range intersected right bound: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIntersectedRightBound
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedRightBound.start,
        currentTo: currentRangeThatIntersectedRightBound.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeThatIntersectedRightBound.start,
        getTo: currentRangeThatIntersectedRightBound.end,

        removeFrom: previousRange.start,
        removeTo: previousRange.end
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range intersected left bound: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIntersectedLeftBound
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedLeftBound.start,
        currentTo: currentRangeThatIntersectedLeftBound.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeThatIntersectedLeftBound.start,
        getTo: currentRangeThatIntersectedLeftBound.end,

        removeFrom: previousRange.start,
        removeTo: previousRange.end
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range (right) not intersected previous: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeNotIntersectedPreviousRight
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeNotIntersectedPreviousRight.start,
        currentTo: currentRangeNotIntersectedPreviousRight.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeNotIntersectedPreviousRight.start,
        getTo: currentRangeNotIntersectedPreviousRight.end,

        removeFrom: previousRange.start,
        removeTo: previousRange.end
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range (left) not intersected previous: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeNotIntersectedPreviousLeft
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeNotIntersectedPreviousLeft.start,
        currentTo: currentRangeNotIntersectedPreviousLeft.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeNotIntersectedPreviousLeft.start,
        getTo: currentRangeNotIntersectedPreviousLeft.end,

        removeFrom: previousRange.start,
        removeTo: previousRange.end
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range including previous with equal start points: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIncludingPreviousWithEqualLeftBound
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIncludingPreviousWithEqualLeftBound.start,
        currentTo: currentRangeThatIncludingPreviousWithEqualLeftBound.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: previousRange.end,
        getTo: currentRangeThatIncludingPreviousWithEqualLeftBound.end,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range including previous with equal end points: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIncludingPreviousWithEqualRightBound
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIncludingPreviousWithEqualRightBound.start,
        currentTo: currentRangeThatIncludingPreviousWithEqualRightBound.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeThatIncludingPreviousWithEqualRightBound.start,
        getTo: previousRange.start,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('previous range is null: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        null,
        currentRangeThatIntersectedRight
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedRight.start,
        currentTo: currentRangeThatIntersectedRight.end,

        previousFrom: null,
        previousTo: null,

        getFrom: currentRangeThatIntersectedRight.start,
        getTo: currentRangeThatIntersectedRight.end,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('previous range arguments (some) is null: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        { start: null, end: 5 },
        currentRangeThatIntersectedRight
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedRight.start,
        currentTo: currentRangeThatIntersectedRight.end,

        previousFrom: null,
        previousTo: null,

        getFrom: currentRangeThatIntersectedRight.start,
        getTo: currentRangeThatIntersectedRight.end,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('previous range arguments (every) is null: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        { start: null, end: null },
        currentRangeThatIntersectedRight
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatIntersectedRight.start,
        currentTo: currentRangeThatIntersectedRight.end,

        previousFrom: null,
        previousTo: null,

        getFrom: currentRangeThatIntersectedRight.start,
        getTo: currentRangeThatIntersectedRight.end,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range includes in previous: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatIncludedInPrevious
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: previousRange.start,
        currentTo: previousRange.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: null,
        getTo: null,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });

    it('current range contains previous: ', () => {
      const paginationArguments: PagedVirtualScrollArguments = ListRangesIntersectionProducer.getPagedVirtualScrollArguments(
        previousRange,
        currentRangeThatContainsPrevious
      );

      const expectedResult: PagedVirtualScrollArguments = {
        currentFrom: currentRangeThatContainsPrevious.start,
        currentTo: currentRangeThatContainsPrevious.end,

        previousFrom: previousRange.start,
        previousTo: previousRange.end,

        getFrom: currentRangeThatContainsPrevious.start,
        getTo: currentRangeThatContainsPrevious.end,

        removeFrom: null,
        removeTo: null
      };
      expect(paginationArguments).toEqual(expectedResult);
    });
  });

  describe('ListRangesIntersectionProducer.roundToBoundingDozensByCount', () => {
    it('range [13, 59], count in viewport 17, total 100 -> [0, 80] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 13, end: 59 },
        17,
        100
      );

      const expectedResult: ListRange = {
        start: 0,
        end: 80
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range [22, 59], count in viewport 17, total 100 -> [10, 80] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 22, end: 59 },
        17,
        100
      );

      const expectedResult: ListRange = {
        start: 10,
        end: 80
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range [46, 79], count in viewport 17, total 100 -> [30, 100] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 46, end: 79 },
        17,
        100
      );

      const expectedResult: ListRange = {
        start: 30,
        end: 100
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range [136, 187], count in viewport 26, total 300 -> [110, 210] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 136, end: 187 },
        26,
        300
      );

      const expectedResult: ListRange = {
        start: 110,
        end: 210
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range [1200, 1533], count in viewport 122, total 5000 -> [1080, 1660] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 1200, end: 1533 },
        122,
        5000
      );

      const expectedResult: ListRange = {
        start: 1080,
        end: 1660
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range [0, 6], count in viewport 5, total 100 -> [0, 10] : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 0, end: 6 },
        5,
        100
      );

      const expectedResult: ListRange = {
        start: 0,
        end: 10
      };
      expect(returnedRange).toEqual(expectedResult);
    });

    it('range null, count in viewport 122, total 5000 -> undefined : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(null, 122, 5000);
      expect(returnedRange).toEqual(undefined);
    });

    it('range [1200, null], count in viewport 122, total 5000 -> undefined : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 1200, end: null },
        122,
        5000
      );
      expect(returnedRange).toEqual(undefined);
    });

    it('range [null, 1533], count in viewport 122, total 5000 -> undefined : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: null, end: 1533 },
        122,
        5000
      );
      expect(returnedRange).toEqual(undefined);
    });

    it('range [1200, 1533], count in viewport null, total 5000 -> undefined : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 1200, end: 1533 },
        null,
        5000
      );
      expect(returnedRange).toEqual(undefined);
    });

    it('range [1200, 1533], count in viewport 122, total null -> undefined : ', () => {
      const returnedRange: ListRange = ListRangesIntersectionProducer.roundToBoundingDozensByCount(
        { start: 1200, end: 1533 },
        122,
        null
      );
      expect(returnedRange).toEqual({ start: 1080, end: 1322 });
    });
  });
});
