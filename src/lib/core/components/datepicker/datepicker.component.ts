import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, skipWhile, take } from 'rxjs/operators';
import { isNullOrUndefined } from 'src/lib/helpers/is-null-or-undefined.helper';

import { dayInMs } from './../../../constants/day-in-ms.const';
import { dateClearTime } from './../../../helpers/date-clear-time.helper';
import { getDaysInMonth } from './../../../helpers/get-days-in-month.helper';

export type DatepickerSelectionMode = 'date' | 'range';
export enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

@Component({
  selector: 'pupa-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent implements OnDestroy {
  public readonly weekDayNames: Set<string> = new Set<string>(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']);

  @Input() public selectionMode: DatepickerSelectionMode = 'range';
  @Input() public set selectedDate(newValue: Date) {
    this.selectedDate$.next(dateClearTime(newValue));
  }

  @Output() public readonly date: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public readonly range: EventEmitter<[Date, Date]> = new EventEmitter<[Date, Date]>();

  public get isDateSelectionMode(): boolean {
    return this.selectionMode === 'date';
  }

  public readonly selectedRange$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  public readonly selectedDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  public readonly hoveredDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);

  public readonly hoveredRange$: Observable<Date[]> = combineLatest([this.selectedRange$, this.hoveredDate$]).pipe(
    filter((aggregatedDates: [Date[], Date]) => {
      const selectedRange: Date[] = aggregatedDates[0];
      const invalidRangeSize: number = 2;
      return !Object.is(selectedRange.length, invalidRangeSize);
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
    shareReplay(1)
  );

  private readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(dateClearTime(new Date()));

  private readonly subscription: Subscription = new Subscription();

  public readonly primarySectionStartDate$: Observable<Date> = this.baseDate$.pipe(
    distinctUntilChanged(),
    map((baseDate: Date) => {
      const baseMonthDay: number = baseDate.getDate();
      const baseDateMs: number = baseDate.valueOf();
      return Object.is(baseMonthDay, 1) ? baseDateMs : baseDateMs - (baseMonthDay - 1) * dayInMs;
    }),
    map((sectionStartDateMs: number) => dateClearTime(new Date(sectionStartDateMs)))
  );

  public readonly primarySectionDates$: Observable<Date[]> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((sectionStartDate: Date) => {
      const daysInMonth: number = getDaysInMonth(sectionStartDate);
      const sectionStartDateMs: number = sectionStartDate.valueOf();
      return new Array(daysInMonth)
        .fill(sectionStartDateMs)
        .map((startDateMs: number, dayInMonth: number) => startDateMs + dayInMonth * dayInMs);
    }),
    map((sectionDatesMs: number[]) => sectionDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs))))
  );

  public readonly primarySectionLeftOffsetDates$: Observable<Date[]> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((sectionStartDate: Date) => {
      const sectionStartDateMs: number = sectionStartDate.valueOf();
      const lastDayOfPreviousMonthMs: number = sectionStartDateMs - dayInMs;
      return dateClearTime(new Date(lastDayOfPreviousMonthMs));
    }),
    map((previousMonthLastDate: Date) => {
      const previousMonthLastDateDayOfWeek: DayOfWeek = previousMonthLastDate.getDay();
      if (previousMonthLastDateDayOfWeek === DayOfWeek.Sunday) {
        return [];
      }
      const previousMonthLastDateMs: number = previousMonthLastDate.valueOf();
      const visibleDaysCount: number = previousMonthLastDateDayOfWeek;
      return new Array(visibleDaysCount)
        .fill(previousMonthLastDateMs)
        .map((lastMonthDateMs: number, multiplier: number) => lastMonthDateMs - multiplier * dayInMs);
    }),
    map((previousMonthDatesMs: number[]) => [...previousMonthDatesMs].reverse()),
    map((reversedPreviousMonthDatesMs: number[]) =>
      reversedPreviousMonthDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs)))
    )
  );

  constructor() {
    this.subscription
      .add(
        this.selectedDate$
          .pipe(
            skipWhile(() => !this.isDateSelectionMode),
            filter((selectedDate: Date) => !isNullOrUndefined(selectedDate)),
            distinctUntilChanged(this.isSameDate)
          )
          .subscribe((selectedDate: Date) => this.date.emit(selectedDate))
      )
      .add(
        this.selectedRange$
          .pipe(
            skipWhile(() => this.isDateSelectionMode),
            filter((selectedRangeDates: Date[]) => {
              const validDatesCount: number = 2;
              return Array.isArray(selectedRangeDates) && Object.is(selectedRangeDates.length, validDatesCount);
            })
          )
          .subscribe((selectedRange: [Date, Date]) => this.range.emit(selectedRange))
      );
  }

  @HostListener('window:click')
  public processWindowClick(): void {
    this.selectedDate$.next(null);
    this.selectedRange$.next([]);
    this.hoveredDate$.next(null);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public switchToPreviousMonth(event: MouseEvent): void {
    event.stopPropagation();
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => {
          const baseDateMonthDay: number = currentBaseDate.getDate();
          const currentBaseDateMs: number = currentBaseDate.valueOf();
          return currentBaseDateMs - baseDateMonthDay * dayInMs;
        }),
        map((newBaseDateMs: number) => dateClearTime(new Date(newBaseDateMs)))
      )
      .subscribe((newBaseDate: Date) => this.baseDate$.next(newBaseDate));
  }

  public switchToNextMonth(event: MouseEvent): void {
    event.stopPropagation();
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => {
          const baseDateMonthDay: number = currentBaseDate.getDate();
          const currentBaseDateMs: number = currentBaseDate.valueOf();
          const currentBaseDateMonthDaysCount: number = getDaysInMonth(currentBaseDate);
          return currentBaseDateMs + (currentBaseDateMonthDaysCount + 1 - baseDateMonthDay) * dayInMs;
        }),
        map((newBaseDateMs: number) => dateClearTime(new Date(newBaseDateMs)))
      )
      .subscribe((newBaseDate: Date) => this.baseDate$.next(newBaseDate));
  }

  public processDateSelection(date: Date, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isDateSelectionMode) {
      this.selectedDate$.next(date);
      return;
    }
    this.selectedRange$
      .pipe(
        take(1),
        map((alreadySelectedDates: Date[]) => {
          return Object.is(alreadySelectedDates.length, 1)
            ? [alreadySelectedDates[alreadySelectedDates.length - 1]]
            : [];
        })
      )
      .subscribe((alreadySelectedDates: Date[]) => this.selectedRange$.next([...alreadySelectedDates, date]));
  }

  public processDateHover(date: Date, event: MouseEvent): void {
    event.stopPropagation();
    if (this.isDateSelectionMode) {
      return;
    }
    this.hoveredDate$.next(date);
  }

  public readonly isSameDate = (dateA: Date, dateB: Date): boolean => {
    if (isNullOrUndefined(dateA) || isNullOrUndefined(dateB)) {
      return false;
    }
    return Object.is(dateA.valueOf(), dateB.valueOf());
  };

  public readonly dateIsInDateRange = (date: Date, dateRange: Date[]): boolean => {
    if (isNullOrUndefined(date) || !Array.isArray(dateRange) || Object.is(dateRange.length, 0)) {
      return false;
    }
    const uniqueRangeItemsMs: Set<number> = new Set<number>(dateRange.map((rangeItem: Date) => rangeItem.valueOf()));
    const validRangeSize: number = 2;
    const rangeIsInvalid: boolean = !Object.is(uniqueRangeItemsMs.size, validRangeSize);
    if (rangeIsInvalid) {
      return false;
    }
    const rangeStartDateIndex: number = dateRange.findIndex(
      (rangeItem: Date, rangeItemIndex: number, rangeItemOrigin: [Date, Date]) => {
        const nextItem: Date = rangeItemOrigin[rangeItemIndex + 1];
        const previousItem: Date = rangeItemOrigin[rangeItemIndex - 1];
        if (isNullOrUndefined(previousItem)) {
          return rangeItem.valueOf() < nextItem.valueOf();
        }
        return rangeItem.valueOf() < previousItem.valueOf();
      }
    );
    const rangeEndDateIndex: number = Object.is(rangeStartDateIndex, 0) ? 1 : 0;
    const rangeStartDateMs: number = dateRange[rangeStartDateIndex].valueOf();
    const rangeEndDateMs: number = dateRange[rangeEndDateIndex].valueOf();
    const dateToTestMs: number = date.valueOf();
    return rangeStartDateMs < dateToTestMs && rangeEndDateMs > dateToTestMs;
  };

  public readonly dateIsInDateArray = (date: Date, dateArray: Date[]): boolean => {
    if (isNullOrUndefined(date) || !Array.isArray(dateArray) || Object.is(dateArray.length, 0)) {
      return false;
    }
    return dateArray.some((dateFromRange: Date) => this.isSameDate(dateFromRange, date));
  };
}
