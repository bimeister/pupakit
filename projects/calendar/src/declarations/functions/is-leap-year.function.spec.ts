import { isLeapYear } from './is-leap-year.function';

describe('is-leap-year.function.ts', () => {
  it('should return true if year is leap', () => {
    const LEAP_YEARS: number[] = [1904, 1920, 1924, 1932, 2000, 2020, 2096];

    LEAP_YEARS.forEach((year: number) => {
      expect(isLeapYear(year)).toBe(true);
    });
  });

  it('should return false if year is not leap', () => {
    const LEAP_YEARS: number[] = [1905, 1919, 1923, 1935, 2001, 2019, 2100];

    LEAP_YEARS.forEach((year: number) => {
      expect(isLeapYear(year)).toBe(false);
    });
  });
});
