import { Injectable } from '@angular/core';
import { distinctUntilSerializedChanged, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CalendarQuickSelectMode } from '../../../declarations/enums/calendar-quick-select-mode.enum';
import { getDateWithClearedTime } from '../../../declarations/functions/get-date-with-cleared-time';
import { getSortedDates } from '../../../declarations/functions/get-sorted-dates.function';

const MULTI_SELECTION_DATES_COUNT: number = 2;

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
  private readonly selectedStartTime$: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  private readonly selectedFinishTime$: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  public readonly resultDates$: Observable<Date[]> = combineLatest([
    this.selectedDates$,
    this.selectedStartTime$,
    this.selectedFinishTime$,
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(([selectedDates, selectedStartTime, selectedFinishTime]: [(Date | null)[], Date | null, Date | null]) => {
      const resultDates: Date[] = [];

      if (!isNil(selectedDates[0])) {
        resultDates[0] = this.combineDateAndTime(selectedDates[0], selectedStartTime);
      }

      if (this.isRange && !isNil(selectedDates[1])) {
        resultDates[1] = this.combineDateAndTime(selectedDates[1], selectedFinishTime);
      }

      return resultDates;
    })
  );

  public readonly quickSelectMode$: BehaviorSubject<CalendarQuickSelectMode | null> =
    new BehaviorSubject<CalendarQuickSelectMode>(null);

  public combineDateAndTime(date: Date, time: Date | null): Date {
    return isNil(time) ? getDateWithClearedTime(date) : new Date(date.setHours(time.getHours(), time.getMinutes()));
  }

  public setStartTime(time: Date | null): void {
    this.selectedStartTime$.next(time);
  }

  public setFinishTime(time: Date | null): void {
    this.selectedFinishTime$.next(time);
  }

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
