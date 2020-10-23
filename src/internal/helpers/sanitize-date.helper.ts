export function sanitizeDate(date: Date): Date {
  return new Date(Date.parse(String(date)));
}
