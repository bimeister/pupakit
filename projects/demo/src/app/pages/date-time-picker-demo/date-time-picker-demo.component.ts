import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

const DEFAULT_DATE: Date = new Date();
const DEFAULT_DATE_NEXT_MONTH: Date = new Date();
DEFAULT_DATE_NEXT_MONTH.setMonth(DEFAULT_DATE.getMonth() + 1);
const DATE_PLUS_FIVE_DAYS: Date = new Date();
DATE_PLUS_FIVE_DAYS.setDate(DATE_PLUS_FIVE_DAYS.getDate() + 5);
const AVAILABLE_START_DATE: Date = new Date();
AVAILABLE_START_DATE.setHours(0, 0, 0, 0);

@Component({
  selector: 'demo-date-time-picker-demo',
  templateUrl: './date-time-picker-demo.component.html',
  styleUrls: ['./date-time-picker-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimePickerDemoComponent {
  public readonly availableEndDate: Date = DATE_PLUS_FIVE_DAYS;
  public readonly availableStartDate: Date = AVAILABLE_START_DATE;
  public readonly infinity: number = Infinity;

  public readonly dateFormControl: FormControl<Date | null> = new FormControl<Date | null>(DEFAULT_DATE);
  public readonly dateTimeFormControl: FormControl<Date | null> = new FormControl<Date | null>(DEFAULT_DATE);
  public readonly dateTimeSecondsFormControl: FormControl<Date | null> = new FormControl<Date | null>(DEFAULT_DATE);
  public readonly timeFormControl: FormControl<Date | null> = new FormControl<Date | null>(DEFAULT_DATE, [
    Validators.required,
  ]);
  public readonly timeSecondsFormControl: FormControl<Date | null> = new FormControl<Date | null>(DEFAULT_DATE, [
    Validators.required,
  ]);
  public readonly rangeFormControl: FormControl<Date[] | null> = new FormControl<Date[] | null>([
    DEFAULT_DATE,
    DEFAULT_DATE_NEXT_MONTH,
  ]);
  public readonly rangeDoubleFormControl: FormControl<Date[] | null> = new FormControl<Date[] | null>([
    DEFAULT_DATE,
    DEFAULT_DATE_NEXT_MONTH,
  ]);

  public readonly useIsBackDatingControl: FormControl<boolean> = new FormControl<boolean>(true);
  public readonly useAvailableEndDateControl: FormControl<boolean> = new FormControl<boolean>(false);
  public readonly useAvailableStartDateControl: FormControl<boolean> = new FormControl<boolean>(false);
}
