import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { dayInMs } from '../../../../../internal/constants/day-in-ms.const';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { dateClearTime } from '../../../../../internal/helpers/date-clear-time.helper';
import { getDaysInMonth } from '../../../../../internal/helpers/get-days-in-month.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { sanitizeDate } from '../../../../../internal/helpers/sanitize-date.helper';

const DEFAULT_CURRENT_DATE: Date = dateClearTime(new Date());

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

  public readonly baseDateNextMont$: Observable<Date> = this.baseDate$.pipe(
    map((baseDate: Date) => {
      const currentMonth: number = baseDate.getMonth();
      const nextMonth: number = currentMonth + 1;
      const currentYear: number = baseDate.getFullYear();
      return dateClearTime(new Date(currentYear, nextMonth, 1));
    })
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
