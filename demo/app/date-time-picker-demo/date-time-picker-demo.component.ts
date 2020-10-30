import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

const DEFAULT_DATE: Date = new Date();
const DEFAULT_DATE_NEXT_MONTH: Date = new Date();
DEFAULT_DATE_NEXT_MONTH.setMonth(DEFAULT_DATE.getMonth() + 1);

@Component({
  selector: 'demo-date-time-picker-demo',
  templateUrl: './date-time-picker-demo.component.html',
  styleUrls: ['../demo.scss', './date-time-picker-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerDemoComponent {
  public readonly dateFormControl: FormControl = new FormControl(DEFAULT_DATE);
  public readonly dateTimeFormControl: FormControl = new FormControl(DEFAULT_DATE);
  public readonly dateTimeSecondsFormControl: FormControl = new FormControl(DEFAULT_DATE);
  public readonly timeFormControl: FormControl = new FormControl(DEFAULT_DATE);
  public readonly timeSecondsFormControl: FormControl = new FormControl(DEFAULT_DATE);
  public readonly rangeFormControl: FormControl = new FormControl([DEFAULT_DATE, DEFAULT_DATE_NEXT_MONTH]);
  public readonly rangeDoubleFormControl: FormControl = new FormControl([DEFAULT_DATE, DEFAULT_DATE_NEXT_MONTH]);
}
