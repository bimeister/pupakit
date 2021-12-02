import { Injectable } from '@angular/core';
import { filterFalsy, filterNotNil, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, NEVER, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DatePickerPreviewMode } from '../../../../internal/declarations/types/date-picker-preview-mode.type';
import { DatePickerSelectionMode } from '../../../../internal/declarations/types/date-picker-selection-mode.type';
import { dateClearTime } from '../../../../internal/helpers/date-clear-time.helper';
import { getRangeEndDate } from '../../../../internal/helpers/get-range-end-date.helper';
import { getRangeStartDate } from '../../../../internal/helpers/get-range-start-date.helper';

const WEEK_DAY_NAMES: string[] = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const INVALID_RANGE_SIZE: number = 2;
const VALID_RANGE_SIZE: number = 2;

const DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME: Date = dateClearTime(new Date());

@Injectable({ providedIn: 'any' })
export class DatePickerStateService {
  public readonly weekDayNames: string[] = WEEK_DAY_NAMES;
  public readonly currentDate: Date = DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME;

  public readonly hours$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly minutes$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly seconds$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly isBackDating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly availableEndDate$: BehaviorSubject<Date | number> = new BehaviorSubject<Date | number>(Infinity);

  public readonly selectionMode$: BehaviorSubject<DatePickerSelectionMode> =
    new BehaviorSubject<DatePickerSelectionMode>('range');

  public readonly previewMode$: BehaviorSubject<DatePickerPreviewMode> = new BehaviorSubject<DatePickerPreviewMode>(
    'simple'
  );

  public readonly withSeconds$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly selectedDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  public readonly selectedRange$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);

  public readonly isSelectionModeDate$: Observable<boolean> = this.selectionMode$.pipe(
    map((selectionMode: DatePickerSelectionMode) => selectionMode === 'date'),
    shareReplayWithRefCount()
  );

  public readonly hoveredDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);

  public readonly hoveredRange$: Observable<Date[]> = combineLatest([this.selectedRange$, this.hoveredDate$]).pipe(
    filter((aggregatedDates: [Date[], Date]) => {
      const selectedRange: Date[] = aggregatedDates[0];
      return !Object.is(selectedRange.length, INVALID_RANGE_SIZE);
    }),
    map((aggregatedDates: [Date[], Date]) => {
      const selectedRange: Date[] = aggregatedDates[0];
      if (Object.is(selectedRange.length, 0)) {
        return [];
      }
      const selectedDateFromRange: Date = selectedRange[selectedRange.length - 1];
      const hoveredDate: Date = aggregatedDates[1];
      return [selectedDateFromRange, hoveredDate];
    }),
    shareReplayWithRefCount()
  );

  public processDateSelection(date: Date): void {
    this.isSelectionModeDate$
      .pipe(
        filterNotNil(),
        take(1),
        switchMap((isSelectionModeDate: boolean) => {
          if (isSelectionModeDate) {
            this.selectedDate$.next(date);
            return NEVER;
          }

          return this.selectedRange$;
        }),
        take(1),
        map((alreadySelectedDates: Date[]) =>
          Object.is(alreadySelectedDates.length, 1) ? [alreadySelectedDates[alreadySelectedDates.length - 1]] : []
        )
      )
      .subscribe((alreadySelectedDates: Date[]) => this.selectedRange$.next([...alreadySelectedDates, date]));
  }

  public processDateHover(date: Date): void {
    this.isSelectionModeDate$.pipe(filterNotNil(), take(1), filterFalsy()).subscribe(() => {
      this.hoveredDate$.next(date);
    });
  }

  public isSameDate(dateA: Date, dateB: Date): boolean {
    return !isNil(dateA) && !isNil(dateB) && Object.is(dateA.valueOf(), dateB.valueOf());
  }

  public dateIsInDateRange(date: Date, dateRange: Date[]): boolean {
    if (isNil(date) || !Array.isArray(dateRange) || Object.is(dateRange.length, 0)) {
      return false;
    }
    const uniqueRangeItemsMs: Set<number> = new Set<number>(
      dateRange.filter((rangeItem: Date) => !isNil(rangeItem)).map((rangeItem: Date) => rangeItem.valueOf())
    );
    const rangeIsInvalid: boolean = !Object.is(uniqueRangeItemsMs.size, VALID_RANGE_SIZE);
    if (rangeIsInvalid) {
      return false;
    }
    const rangeStartDate: Date = getRangeStartDate(dateRange);
    const rangeEndDate: Date = getRangeEndDate(dateRange);
    const rangeStartDateMs: number = rangeStartDate.valueOf();
    const rangeEndDateMs: number = rangeEndDate.valueOf();
    const dateToTestMs: number = date.valueOf();

    return rangeStartDateMs < dateToTestMs && rangeEndDateMs > dateToTestMs;
  }

  public dateIsInDateArray(date: Date, dateArray: Date[]): boolean {
    if (isNil(date) || !Array.isArray(dateArray) || Object.is(dateArray.length, 0)) {
      return false;
    }
    return dateArray.some((dateFromRange: Date) => this.isSameDate(dateFromRange, date));
  }

  public dateIsRangeStartDate(date: Date, dateRange: Date[]): boolean {
    if (isNil(date) || !Array.isArray(dateRange) || Object.is(dateRange.length, 0)) {
      return false;
    }
    const uniqueRangeItemsMs: Set<number> = new Set<number>(
      dateRange.filter((rangeItem: Date) => !isNil(rangeItem)).map((rangeItem: Date) => rangeItem.valueOf())
    );
    const rangeIsInvalid: boolean = !Object.is(uniqueRangeItemsMs.size, VALID_RANGE_SIZE);
    if (rangeIsInvalid) {
      return false;
    }
    const rangeStartDate: Date = getRangeStartDate(dateRange);
    return this.isSameDate(rangeStartDate, date);
  }

  public dateIsRangeEndDate(date: Date, dateRange: Date[]): boolean {
    if (isNil(date) || !Array.isArray(dateRange) || Object.is(dateRange.length, 0)) {
      return false;
    }
    const uniqueRangeItemsMs: Set<number> = new Set<number>(
      dateRange.filter((rangeItem: Date) => !isNil(rangeItem)).map((rangeItem: Date) => rangeItem.valueOf())
    );
    const rangeIsInvalid: boolean = !Object.is(uniqueRangeItemsMs.size, VALID_RANGE_SIZE);
    if (rangeIsInvalid) {
      return false;
    }
    const rangeEndDate: Date = getRangeEndDate(dateRange);
    return this.isSameDate(rangeEndDate, date);
  }

  public dateIsNotAvailable(date: Date, isBackDating: boolean, availableEndDate: Date | number): boolean {
    return (!isBackDating && date < DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME) || date > availableEndDate;
  }

  public isDateStartInHoveredAndSelectedRange(date: Date, hoveredRange: Date[], selectedRange: Date[]): boolean {
    return this.dateIsRangeStartDate(date, hoveredRange) || this.dateIsRangeStartDate(date, selectedRange);
  }

  public isDateEndInHoveredAndSelectedRange(date: Date, hoveredRange: Date[], selectedRange: Date[]): boolean {
    return this.dateIsRangeEndDate(date, hoveredRange) || this.dateIsRangeEndDate(date, selectedRange);
  }
}
