export const dateClearTime = (date: Date): Date => {
  const sanitizedDate: Date = date;
  sanitizedDate.setHours(0, 0, 0, 0);
  return sanitizedDate;
};
