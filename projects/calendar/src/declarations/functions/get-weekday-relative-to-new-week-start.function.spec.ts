import { DayOfWeek } from '../enums/day-of-week.enum';
import { getWeekdayRelativeToNewWeekStart } from './get-weekday-relative-to-new-week-start.function';

describe('get-weekday-relative-to-new-week-start.function.ts', () => {
  it('should return right weekdays if start of week changed from Sunday to Monday', () => {
    const testCases: [DayOfWeek, DayOfWeek][] = [
      [DayOfWeek.Monday, DayOfWeek.Sunday],
      [DayOfWeek.Tuesday, DayOfWeek.Monday],
      [DayOfWeek.Wednesday, DayOfWeek.Tuesday],
      [DayOfWeek.Thursday, DayOfWeek.Wednesday],
      [DayOfWeek.Friday, DayOfWeek.Thursday],
      [DayOfWeek.Saturday, DayOfWeek.Friday],
      [DayOfWeek.Sunday, DayOfWeek.Saturday],
    ];

    testCases.forEach(([inputWeekday, outputWeekday]: [DayOfWeek, DayOfWeek]) => {
      expect(getWeekdayRelativeToNewWeekStart(inputWeekday, DayOfWeek.Sunday, DayOfWeek.Monday)).toBe(outputWeekday);
    });
  });

  it('should return right weekdays if start of week changed from Monday to Sunday', () => {
    const testCases: [DayOfWeek, DayOfWeek][] = [
      [DayOfWeek.Monday, DayOfWeek.Tuesday],
      [DayOfWeek.Tuesday, DayOfWeek.Wednesday],
      [DayOfWeek.Wednesday, DayOfWeek.Thursday],
      [DayOfWeek.Thursday, DayOfWeek.Friday],
      [DayOfWeek.Friday, DayOfWeek.Saturday],
      [DayOfWeek.Saturday, DayOfWeek.Sunday],
      [DayOfWeek.Sunday, DayOfWeek.Monday],
    ];

    testCases.forEach(([inputWeekday, outputWeekday]: [DayOfWeek, DayOfWeek]) => {
      expect(getWeekdayRelativeToNewWeekStart(inputWeekday, DayOfWeek.Monday, DayOfWeek.Sunday)).toBe(outputWeekday);
    });
  });
});
