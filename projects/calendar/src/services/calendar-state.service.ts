import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { CalendarQuickSelectMode } from '../declarations/enums/calendar-quick-select-mode.enum';
import { getClearDate } from '../declarations/functions/get-clear-date.function';
import { getSortedDates } from '../declarations/functions/get-sorted-dates.function';

const MULTI_SELECTION_DATES_COUNT: number = 2;

function getDateWithClearedTime(date: Date): Date {
  const clearDate: Date = getClearDate();

  clearDate.setFullYear(date.getFullYear());
  clearDate.setMonth(date.getMonth());
  clearDate.setDate(date.getDate());

  return clearDate;
}

function findDateIndexInArray(array: Date[], date: Date): number {
  return array.findIndex((item: Date) => item.getTime() === date.getTime());
}

function getUniqDates(dates: Date[]): Date[] {
  return dates.filter((date: Date, index: number, array: Date[]) => {
    const foundIndex: number = findDateIndexInArray(array, date);

    return foundIndex === index;
  });
}

function getProcessedDates(dates: Date[]): Date[] {
  return getSortedDates(getUniqDates(dates.map(getDateWithClearedTime)), 'ascending');
}

@Injectable()
export class CalendarStateService {
  private isRange: boolean = false;

  public readonly selectedDates$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);

  public readonly quickSelectMode$: BehaviorSubject<CalendarQuickSelectMode | null> =
    new BehaviorSubject<CalendarQuickSelectMode>(null);

  public setSelectedDates(dates: Date[]): void {
    this.selectedDates$.next(getProcessedDates(dates));
  }

  public addSelectedDate(newDate: Date): void {
    const preparedDate: Date = getDateWithClearedTime(newDate);

    this.selectedDates$.pipe(take(1)).subscribe((selectedDates: Date[]) => {
      const updatedDates: Date[] = this.isRange
        ? this.patchDatesForRangeSelection(selectedDates, preparedDate)
        : [preparedDate];

      this.selectedDates$.next(updatedDates);
    });
  }

  public patchDatesForRangeSelection(dates: Date[], newDate: Date): Date[] {
    const hasAlreadyAdded: boolean = findDateIndexInArray(dates, newDate) >= 0;
    const isResetNeeded: boolean = dates.length >= MULTI_SELECTION_DATES_COUNT;

    if (hasAlreadyAdded || isResetNeeded) {
      return [newDate];
    }

    return getProcessedDates([...dates, newDate]);
  }

  public setQuickSelectMode(mode: CalendarQuickSelectMode): void {
    this.quickSelectMode$.next(mode);
  }

  public resetQuickSelectMode(): void {
    this.quickSelectMode$.next(null);
  }

  public setIsRange(isRange: boolean): void {
    this.isRange = isRange;
  }
}
