import { DayOfWeek } from '../enums/day-of-week.enum';
import { getWeeksCountInMonth } from './get-weeks-count-in-month.function';

interface TestCase {
  input: [number, number, DayOfWeek];
  output: number;
}

describe('get-weeks-count-in-month.function.ts', () => {
  it('should return weeks for months', () => {
    const testCases: TestCase[] = [
      {
        input: [2022, 7, DayOfWeek.Sunday],
        output: 6,
      },
      {
        input: [2022, 7, DayOfWeek.Saturday],
        output: 6,
      },
      {
        input: [2022, 7, DayOfWeek.Monday],
        output: 5,
      },
      {
        input: [2022, 1, DayOfWeek.Monday],
        output: 6,
      },
      {
        input: [2047, 11, DayOfWeek.Sunday],
        output: 5,
      },
      {
        input: [1984, 2, DayOfWeek.Sunday],
        output: 5,
      },
      {
        input: [1924, 9, DayOfWeek.Monday],
        output: 5,
      },
      {
        input: [2100, 3, DayOfWeek.Monday],
        output: 5,
      },
    ];

    testCases.forEach((testCase: TestCase) => {
      expect(getWeeksCountInMonth(...testCase.input)).toBe(testCase.output);
    });
  });
});
