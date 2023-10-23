import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { dateClearTime } from '../../../../declarations/functions/date-clear-time.function';

const DEFAULT_YEAR: number = dateClearTime(new Date()).getFullYear();
const YEARS_IN_SECTION: number = 30;
const DEFAULT_YEARS: number[] = Array(YEARS_IN_SECTION)
  .fill(0)
  .map((_year: number, index: number) => DEFAULT_YEAR + index);

@Component({
  selector: 'pupa-date-picker-years',
  templateUrl: './date-picker-years.component.html',
  styleUrls: ['./date-picker-years.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerYearsComponent implements OnChanges {
  @Input() public years: number[] = DEFAULT_YEARS;
  public readonly years$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(DEFAULT_YEARS);

  public readonly currentYear: number = DEFAULT_YEAR;

  @Output() private readonly selectedYear: EventEmitter<number> = new EventEmitter<number>();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processYearsChange(changes?.years);
  }

  public selectYear(year: number): void {
    this.selectedYear.emit(year);
  }

  private processYearsChange(change: ComponentChange<this, number[]>): void {
    const updatedValue: number[] | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.years$.next(updatedValue);
  }
}
