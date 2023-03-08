/** @note
 * if number of year is a multiple of 400 => year is leap
 * if number of year is a multiple of 100 => year is not leap
 * if other number of year is a multiple of 4 => year is leap
 * other years are not leap
 * */
export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) {
    return true;
  }

  if (year % 100 === 0) {
    return false;
  }

  return year % 4 === 0;
}
