import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { dayInMs } from '../../../../../internal/constants/day-in-ms.const';
import { DayOfWeek } from '../../../../../internal/declarations/enums/day-of-week.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { dateClearTime } from '../../../../../internal/helpers/date-clear-time.helper';
import { getDaysInMonth } from '../../../../../internal/helpers/get-days-in-month.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { sanitizeDate } from '../../../../../internal/helpers/sanitize-date.helper';

const DEFAULT_CURRENT_DATE: Date = dateClearTime(new Date());
const DAYS_COUNT_IN_STANDARD_GRID: number = 35;

@Component({
  selector: 'pupa-date-picker-double',
  templateUrl: './date-picker-double.component.html',
  styleUrls: ['./date-picker-double.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerDoubleComponent implements OnChanges {
  @Input() public readonly baseDate: Date = DEFAULT_CURRENT_DATE;
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE);

  public readonly baseDateNextMonth$: Observable<Date> = this.baseDate$.pipe(
    map((baseDate: Date) => {
      const currentMonth: number = baseDate.getMonth();
      const nextMonth: number = currentMonth + 1;
      const currentYear: number = baseDate.getFullYear();
      return dateClearTime(new Date(currentYear, nextMonth, 1));
    })
  );

  public readonly needLeftCalendarAddedWeek$: Observable<boolean> = this.baseDateNextMonth$.pipe(
    distinctUntilChanged(),
    switchMap((date: Date) => this.needCalendarAddedWeek(date))
  );

  public readonly needRightCalendarAddedWeek$: Observable<boolean> = this.baseDate$.pipe(
    distinctUntilChanged(),
    switchMap((date: Date) => this.needCalendarAddedWeek(date))
  );

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processBaseDateChange(changes?.baseDate);
  }

  public switchToPreviousMonth(): void {
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
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
      });
  }

  public switchToNextMonth(): void {
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
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
      });
  }

  public needCalendarAddedWeek(date: Date): Observable<boolean> {
    return of(date).pipe(
      filter((baseDate: Date) => isDate(baseDate)),
      map((baseDate: Date) => {
        const baseMonthDay: number = baseDate.getDate();
        const baseDateMs: number = baseDate.valueOf();
        return Object.is(baseMonthDay, 1) ? baseDateMs : baseDateMs - (baseMonthDay - 1) * dayInMs;
      }),
      map((sectionStartDateMs: number) => dateClearTime(new Date(sectionStartDateMs))),
      map((startDate: Date) => {
        const daysInMonth: number = getDaysInMonth(startDate);
        const startDateDayOfWeek: DayOfWeek = startDate.getDay();
        const countOfLeftDays: number = startDateDayOfWeek === DayOfWeek.Sunday ? 6 : startDateDayOfWeek - 1;

        const resultDaysCount: number = countOfLeftDays + daysInMonth;

        return resultDaysCount > DAYS_COUNT_IN_STANDARD_GRID;
      })
    );
  }

  private processBaseDateChange(change: ComponentChange<this, Date>): void {
    const updatedValue: Date | undefined = change?.currentValue;

    if (isNil(updatedValue) || !isDate(updatedValue)) {
      return;
    }
    const sanitizedDate: Date = sanitizeDate(updatedValue);
    const sanitizedDateWithClearedTime: Date = dateClearTime(sanitizedDate);
    this.baseDate$.next(sanitizedDateWithClearedTime);
  }
}
