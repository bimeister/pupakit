import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { getDateFromCalendarDay } from '../../../../declarations/functions/get-date-from-calendar-day.function';
import { getDateWithClearedTime } from '../../../../declarations/functions/get-date-with-cleared-time';
import { CalendarDay } from '../../../../declarations/interfaces/calendar-day.interface';
import { CalendarMonth } from '../../../../declarations/interfaces/calendar-month.interface';

@Component({
  selector: 'pupa-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthComponent implements OnChanges {
  @Input() public calendarMonth: CalendarMonth;
  @Input() public isCurrent: boolean = false;
  @Input() public selectedDates: Date[] = [];

  @Output() public readonly selectDate: EventEmitter<Date> = new EventEmitter<Date>();

  public selectedDatesWithoutTime: Date[] = [];

  public readonly currentDayNumber: number = new Date().getDate();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('selectedDates')) {
      const selectedDates: Date[] = changes.selectedDates.currentValue;
      this.selectedDatesWithoutTime = selectedDates.map((date: Date) => getDateWithClearedTime(date));
    }
  }

  public handleSelectDay(calendarDay: CalendarDay | null): void {
    if (isNil(calendarDay)) {
      return;
    }

    this.selectDate.emit(getDateFromCalendarDay(calendarDay));
  }
}
