import { MONTHS_IN_YEAR } from '../constants/months-in-year.const';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../constants/small-calendar-cycle-size-in-years.const';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { getHeightForEachMonthInCalendarCycle } from './get-height-for-each-month-in-calendar-cycle.function';
import { getWeeksCountInMonth } from './get-weeks-count-in-month.function';

const FAKE_START_YEAR: number = new Date().getFullYear() - 100;

describe('get-height-for-each-month-in-calendar-cycle.function.ts', () => {
  const FAKE_LABEL_HEIGHT_PX: number = 11;
  const FAKE_WEEK_HEIGHT_PX: number = 21;
  const FAKE_DIVIDER_HEIGHT_PX: number = 10;

  const result: readonly (readonly number[])[] = getHeightForEachMonthInCalendarCycle({
    labelHeightPx: FAKE_LABEL_HEIGHT_PX,
    weekHeightPx: FAKE_WEEK_HEIGHT_PX,
    dividerHeightPx: FAKE_DIVIDER_HEIGHT_PX,
    startWeekday: DayOfWeek.Sunday,
    startYear: FAKE_START_YEAR,
  });

  it(`should return an array with length ${SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS}`, () => {
    expect(result).toHaveLength(SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS);
  });

  it(`should return array of arrays with length ${MONTHS_IN_YEAR}`, () => {
    const expected: boolean = result.every((array: readonly number[]) => array.length === MONTHS_IN_YEAR);

    expect(expected).toBe(true);
  });

  it('should return array of arrays with height of month, label and two dividers', () => {
    const expected: readonly (readonly number[])[] = new Array(SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS)
      .fill(0)
      .map((_: unknown, yearIndex: number) =>
        new Array(MONTHS_IN_YEAR)
          .fill(0)
          .map(
            (__: unknown, monthIndex: number) =>
              FAKE_LABEL_HEIGHT_PX +
              FAKE_DIVIDER_HEIGHT_PX * 2 +
              getWeeksCountInMonth(yearIndex + FAKE_START_YEAR, monthIndex + 1, DayOfWeek.Sunday) * FAKE_WEEK_HEIGHT_PX
          )
      );

    expect(expected).toEqual(result);
  });
});
