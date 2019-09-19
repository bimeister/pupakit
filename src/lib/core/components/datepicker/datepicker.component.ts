import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { dayInMs } from './../../../constants/day-in-ms.const';
import { dateClearTime } from './../../../helpers/date-clear-time.helper';
import { getDaysInMonth } from './../../../helpers/get-days-in-month.helper';

export type DatepickerSelectionMode = 'date' | 'range';

@Component({
  selector: 'pupa-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerComponent {
  @Input() public selectionMode: DatepickerSelectionMode = 'date';

  private readonly currentDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(dateClearTime(new Date()));
  public readonly primaryRangeStartDate$: Observable<Date> = this.currentDate$.pipe(
    distinctUntilChanged(),
    map((currentDate: Date) => {
      const currentMonthDay: number = currentDate.getDate();
      const currentDateMs: number = currentDate.valueOf();
      return Object.is(currentMonthDay, 1) ? currentDateMs : currentDateMs - currentMonthDay * dayInMs;
    }),
    map((rangeStartDateMs: number) => dateClearTime(new Date(rangeStartDateMs)))
  );
  public readonly primaryRangeEndDate$: Observable<Date> = this.primaryRangeStartDate$.pipe(
    distinctUntilChanged(),
    map((rangeStartDate: Date) => {
      const daysInMonth: number = getDaysInMonth(rangeStartDate);
      const rangeStartDateMs: number = rangeStartDate.valueOf();
      return rangeStartDateMs + (daysInMonth - 1) * dayInMs;
    }),
    map((rangeEndDateMs: number) => dateClearTime(new Date(rangeEndDateMs)))
  );

  public readonly weekDayNames: Set<string> = new Set<string>(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']);
}
