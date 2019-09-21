export function isDate(date: unknown): boolean {
  const dateMs: number = Date.parse(String(date));
  return !Number.isNaN(dateMs);
}
