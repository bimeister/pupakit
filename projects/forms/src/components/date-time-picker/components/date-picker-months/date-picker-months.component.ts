import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { dateClearTime } from '../../../../declarations/functions/date-clear-time.function';

const DEFAULT_MONTH: number = dateClearTime(new Date()).getMonth();
const MONTH_COUNT: number = 12;

@Component({
  selector: 'pupa-date-picker-months',
  templateUrl: './date-picker-months.component.html',
  styleUrls: ['./date-picker-months.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerMonthsComponent {
  public readonly currentMonth: number = DEFAULT_MONTH;

  public readonly months: Date[] = Array(MONTH_COUNT)
    .fill(new Date())
    .map((date: Date, index: number) => {
      date.setMonth(index, 1);
      return dateClearTime(new Date(date));
    });

  @Output() private readonly selectedMonth: EventEmitter<number> = new EventEmitter<number>();

  public selectMonth(month: number): void {
    this.selectedMonth.emit(month);
  }
}
