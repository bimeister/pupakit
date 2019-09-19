import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';
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
export class DatepickerComponent {
  public readonly weekDayNames: Set<string> = new Set<string>(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']);

  @Input() public selectionMode: DatepickerSelectionMode = 'date';
  @Input() public set selectedDate(newValue: Date) {
    this.selectedDate$.next(dateClearTime(newValue));
  }

  @Output() public readonly date: EventEmitter<Date> = new EventEmitter<Date>();

  public readonly selectedDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  private readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(dateClearTime(new Date()));

  public readonly primaryRangeStartDate$: Observable<Date> = this.baseDate$.pipe(
    distinctUntilChanged(),
    map((baseDate: Date) => {
      const baseMonthDay: number = baseDate.getDate();
      const baseDateMs: number = baseDate.valueOf();
      return Object.is(baseMonthDay, 1) ? baseDateMs : baseDateMs - (baseMonthDay - 1) * dayInMs;
    }),
    map((rangeStartDateMs: number) => dateClearTime(new Date(rangeStartDateMs)))
  );

  public readonly primaryRangeDates$: Observable<Date[]> = this.primaryRangeStartDate$.pipe(
    distinctUntilChanged(),
    map((rangeStartDate: Date) => {
      const daysInMonth: number = getDaysInMonth(rangeStartDate);
      const rangeStartDateMs: number = rangeStartDate.valueOf();
      return new Array(daysInMonth)
        .fill(rangeStartDateMs)
        .map((startDateMs: number, dayInMonth: number) => startDateMs + dayInMonth * dayInMs);
    }),
    map((rangeDatesMs: number[]) => rangeDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs))))
  );

  public readonly primaryRangeLeftOffsetDates$: Observable<Date[]> = this.primaryRangeStartDate$.pipe(
    distinctUntilChanged(),
    map((rangeStartDate: Date) => {
      const rangeStartDateMs: number = rangeStartDate.valueOf();
      const lastDayOfPreviousMonthMs: number = rangeStartDateMs - dayInMs;
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

  public selectDate(date: Date, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedDate$.next(date);
    console.log(this.selectedDate$.value);
  }

  public readonly isSameDate = (dateA: Date, dateB: Date): boolean => {
    if (isNullOrUndefined(dateA) || isNullOrUndefined(dateB)) {
      return false;
    }
    return Object.is(dateA.valueOf(), dateB.valueOf());
  };
}
