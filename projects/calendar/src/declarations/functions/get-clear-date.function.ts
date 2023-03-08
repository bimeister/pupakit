export function getClearDate(): Date {
  const date: Date = new Date(null);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}
