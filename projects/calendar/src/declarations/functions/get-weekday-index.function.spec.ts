import { MonthIndex } from '../enums/month-index.enum';
import { getWeekdayIndex } from './get-weekday-index.function';

interface TestCase {
  input: [number, MonthIndex, number];
  output: number;
}

describe('get-weekday-index.function.ts', () => {
  it('returns right weekday index', () => {
    const testCases: TestCase[] = [
      {
        input: [2122, MonthIndex.September, 30],
        output: 3,
      },
      {
        input: [2057, MonthIndex.December, 31],
        output: 1,
      },
      {
        input: [2053, MonthIndex.May, 31],
        output: 6,
      },
      {
        input: [2025, MonthIndex.August, 26],
        output: 2,
      },
      {
        input: [2022, MonthIndex.July, 11],
        output: 1,
      },
      {
        input: [2020, MonthIndex.February, 29],
        output: 6,
      },
      {
        input: [2017, MonthIndex.July, 30],
        output: 0,
      },
      {
        input: [1983, MonthIndex.June, 9],
        output: 4,
      },
      {
        input: [1968, MonthIndex.November, 22],
        output: 5,
      },
      {
        input: [1922, MonthIndex.January, 7],
        output: 6,
      },
    ];

    testCases.forEach((testCase: TestCase) => {
      expect(getWeekdayIndex(...testCase.input)).toBe(testCase.output);
    });
  });
});
