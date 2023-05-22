import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TimeDigitFormatPipe } from '@bimeister/pupakit.common';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';

const DATE_FORMAT: string = 'dd.MM.yyyy';
const DATE_MASK: string = '00.00.0000';
const DATE_MASK_SIZE: number = DATE_MASK.length;

@Component({
  selector: 'pupa-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss'],
  providers: [TimeDigitFormatPipe, DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangeComponent extends InputDateTimeBase {
  public readonly dateRangeMask: string = `${DATE_MASK} – ${DATE_MASK}`;
  public readonly maxLengthInputValue: number = this.dateRangeMask.length;

  public readonly dateRangeFirst$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    map((inputValue: string) => {
      if (inputValue.length <= DATE_MASK_SIZE) {
        return null;
      }
      const value: string = inputValue.slice(0, DATE_MASK_SIZE);
      return this.getParsedDate(value);
    }),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableStartDate$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableStartDate, availableEndDate]]: [Date, [boolean, Date, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableStartDate, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date, Date]]) => date)
  );

  public readonly dateRangeSecond$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.trim()),
    map((inputValue: string) => {
      if (inputValue.length < this.maxLengthInputValue) {
        return null;
      }
      const value: string = inputValue.slice(-DATE_MASK_SIZE);

      return this.getParsedDate(value);
    }),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableStartDate$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableStartDate, availableEndDate]]: [Date, [boolean, Date, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableStartDate, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date, Date]]) => date)
  );

  public readonly range$: Observable<[Date, Date]> = combineLatest([this.dateRangeFirst$, this.dateRangeSecond$]);

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue.slice(0, this.maxLengthInputValue));
  }

  public writeValue(newValue: any): void {
    if (isEmpty(newValue)) {
      this.setValue('');
      return;
    }

    if (!Array.isArray(newValue)) {
      throw new Error('[InputDateRangeComponent] value in not array in writeValue');
    }

    const dateFirst: Date = newValue[0];
    const dateSecond: Date = newValue[1];

    if (isNil(dateFirst) || isNil(dateSecond)) {
      this.setValue('');
      return;
    }

    const serializedValueDateFirst: string = String(dateFirst);
    const serializedValueDateSecond: string = String(dateSecond);

    const parsedValueFirst: string = this.datePipe.transform(serializedValueDateFirst, DATE_FORMAT);
    const parsedValueSecond: string = this.datePipe.transform(serializedValueDateSecond, DATE_FORMAT);

    this.setValue(`${parsedValueFirst} - ${parsedValueSecond}`);
  }

  public handleChangedValue(onChangeCallback: OnChangeCallback<any>, value: ValueType): void {
    const serializedValue: string = String(value);

    if (isEmpty(serializedValue)) {
      onChangeCallback([null, null]);
      this.setValue('');
      return;
    }

    if (serializedValue.length < this.maxLengthInputValue) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const datePartFirst: string = serializedValue.slice(0, DATE_MASK_SIZE);
    const datePartSecond: string = serializedValue.slice(DATE_MASK_SIZE + 2).trim();

    const dateFirst: Date = this.getParsedDate(datePartFirst);
    const dateSecond: Date = this.getParsedDate(datePartSecond);

    if (isNil(dateFirst) || isNil(dateSecond)) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const range: [Date, Date] = dateFirst < dateSecond ? [dateFirst, dateSecond] : [dateSecond, dateFirst];

    onChangeCallback(range);
    this.setValue(serializedValue);
  }
}
