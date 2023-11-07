import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { getCalendarDayFromDate } from '../../../declarations/functions/get-calendar-day-from-date.function';
import { CalendarDay } from '../../../declarations/interfaces/calendar-day.interface';

@Pipe({
  name: 'isDaySelected',
  pure: true,
})
export class IsDaySelectedPipe implements PipeTransform {
  public transform({ day, month, year }: CalendarDay, selectedDates: Date[]): boolean {
    const foundDate: Date | undefined = selectedDates.find((selectedDate: Date) => {
      const selectedDay: CalendarDay = getCalendarDayFromDate(selectedDate);

      return selectedDay.day === day && selectedDay.month === month && selectedDay.year === year;
    });

    return !isNil(foundDate);
  }
}
