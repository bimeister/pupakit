export function isDate(date: unknown): boolean {
  return !Number.isNaN(Date.parse(String(date)));
}
