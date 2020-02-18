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

import {
  dateClearTime,
  DatepickerSelectionMode,
  dayInMs,
  DayOfWeek,
  getDaysInMonth,
  getRangeEndDate,
  getRangeStartDate,
  isDate,
  isNullOrUndefined
} from '../../../../internal';

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
    if (!isDate(newValue)) {
      return;
    }
    const sanitizedDate: Date = new Date(Date.parse(String(newValue)));
    this.selectedDate$.next(dateClearTime(sanitizedDate));
    this.baseDate$.next(dateClearTime(sanitizedDate));
  }
  @Input() public set selectedRange(newValue: Date[]) {
    const parsedArray: Date[] = String(newValue)
      .split(',')
      .map((arrayItem: string) => new Date(Date.parse(arrayItem)))
      .filter((rangeDate: Date) => isDate(rangeDate));
    if (!Array.isArray(parsedArray)) {
      return;
    }
    const sanitizedRange: Date[] = parsedArray
      .filter((rangeDate: Date) => isDate(rangeDate))
      .map((rangeDate: Date) => dateClearTime(rangeDate));
    if (Object.is(sanitizedRange.length, 0)) {
      return;
    }
    this.selectedRange$.next(sanitizedRange);
    this.baseDate$.next(sanitizedRange[0]);
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
    filter((baseDate: Date) => isDate(baseDate)),
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
            }),
            distinctUntilChanged(
              (previousValue: Date[], currentValue: Date[]) =>
                JSON.stringify(previousValue) === JSON.stringify(currentValue)
            )
          )
          .subscribe((selectedRange: [Date, Date]) => this.range.emit(selectedRange))
      );
  }

  @HostListener('window:click')
  public processWindowClick(): void {
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
    const uniqueRangeItemsMs: Set<number> = new Set<number>(
      dateRange.filter((rangeItem: Date) => !isNullOrUndefined(rangeItem)).map((rangeItem: Date) => rangeItem.valueOf())
    );
    const validRangeSize: number = 2;
    const rangeIsInvalid: boolean = !Object.is(uniqueRangeItemsMs.size, validRangeSize);
    if (rangeIsInvalid) {
      return false;
    }
    const rangeStartDate: Date = getRangeStartDate(dateRange);
    const rangeEndDate: Date = getRangeEndDate(dateRange);
    const rangeStartDateMs: number = rangeStartDate.valueOf();
    const rangeEndDateMs: number = rangeEndDate.valueOf();
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
