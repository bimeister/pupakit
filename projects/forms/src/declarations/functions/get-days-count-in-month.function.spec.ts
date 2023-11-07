import { MonthIndex } from '../enums/month-index.enum';
import { getDaysCountInMonth } from './get-days-count-in-month.function';

type TestInput = [MonthIndex, boolean];

function getTestInputsForMonths(months: MonthIndex[]): TestInput[] {
  return months.flatMap((month: MonthIndex) => [
    [month, true],
    [month, false],
  ]);
}

describe('get-days-count-in-month.function.ts', () => {
  it('should always return 30 for April, June, September, November', () => {
    const testInputs: TestInput[] = getTestInputsForMonths([
      MonthIndex.April,
      MonthIndex.June,
      MonthIndex.September,
      MonthIndex.November,
    ]);

    testInputs.forEach((input: TestInput) => {
      expect(getDaysCountInMonth(...input)).toBe(30);
    });
  });

  it('should always return 31 for January, March, May, July, August, October, December', () => {
    const testInputs: TestInput[] = getTestInputsForMonths([
      MonthIndex.January,
      MonthIndex.March,
      MonthIndex.May,
      MonthIndex.July,
      MonthIndex.August,
      MonthIndex.October,
      MonthIndex.December,
    ]);

    testInputs.forEach((input: TestInput) => {
      expect(getDaysCountInMonth(...input)).toBe(31);
    });
  });

  it('should return 28 for February in normal year', () => {
    expect(getDaysCountInMonth(MonthIndex.February, false)).toBe(28);
  });

  it('should return 29 for February in leap year', () => {
    expect(getDaysCountInMonth(MonthIndex.February, true)).toBe(29);
  });
});
