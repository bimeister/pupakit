import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TimeDigitFormatPipe } from '@bimeister/pupakit.common';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';

const DATE_FORMAT: string = 'dd.MM.yyyy';

@Component({
  selector: 'pupa-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [TimeDigitFormatPipe, DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent extends InputDateTimeBase {
  public readonly dateMask: string = '00.00.0000';
  public readonly maxLengthInputValue: number = this.dateMask.length;

  public readonly date$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    filter((value: string) => isEmpty(value) || value.length === this.maxLengthInputValue),
    distinctUntilChanged(),
    map((value: string) => this.getParsedDate(value)),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableStartDate$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableStartDate, availableEndDate]]: [Date, [boolean, Date, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableStartDate, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date, Date]]) => date)
  );

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public writeValue(newValue: ValueType): void {
    if (isNil(newValue)) {
      this.setValue('');
      return;
    }

    const serializedValue: string = String(newValue);
    const parsedValue: string = this.datePipe.transform(serializedValue, DATE_FORMAT);

    this.setValue(parsedValue);
  }

  public handleChangedValue(onChangeCallback: OnChangeCallback<any>, value: ValueType): void {
    const serializedValue: string = String(value);

    if (isEmpty(serializedValue)) {
      onChangeCallback(null);
      this.setValue('');
      return;
    }

    if (serializedValue.length < this.maxLengthInputValue) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const date: Date = this.getParsedDate(serializedValue);
    if (isNil(date)) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    onChangeCallback(date);
    this.setValue(serializedValue);
  }
}
