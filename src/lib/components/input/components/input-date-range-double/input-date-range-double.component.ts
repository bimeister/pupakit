import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { filterNotNil, isEmpty, isNil } from '@meistersoft/utilities';
import { combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../../internal/declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const PLACEHOLDER_DATE: string = '00.00.0000';
const PLACEHOLDER: string = `${PLACEHOLDER_DATE} - ${PLACEHOLDER_DATE}`;
const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;

const SIZE_PLACEHOLDER_DATE: number = PLACEHOLDER_DATE.length;

const DATE_FORMAT: string = 'dd.MM.yyyy';

@Component({
  selector: 'pupa-input-date-range-double',
  templateUrl: './input-date-range-double.component.html',
  styleUrls: ['./input-date-range-double.component.scss'],
  providers: [TimeFormatPipe, DatePipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateRangeDoubleComponent extends InputDateTimeBase {
  public readonly dateRangeFirst$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    map((inputValue: string) => {
      if (inputValue.length <= SIZE_PLACEHOLDER_DATE) {
        return null;
      }
      const value: string = inputValue.slice(0, SIZE_PLACEHOLDER_DATE);
      return this.getParsedDate(value);
    }),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableEndDate]]: [Date, [boolean, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date]]) => date)
  );

  public readonly dateRangeSecond$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.trim()),
    map((inputValue: string) => {
      if (inputValue.length < MAX_LENGTH_INPUT_VALUE) {
        return null;
      }
      const value: string = inputValue.slice(-SIZE_PLACEHOLDER_DATE);

      return this.getParsedDate(value);
    }),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableEndDate]]: [Date, [boolean, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date]]) => date)
  );

  public readonly range$: Observable<[Date, Date]> = combineLatest([this.dateRangeFirst$, this.dateRangeSecond$]);

  public readonly maxLengthInputValue: number = MAX_LENGTH_INPUT_VALUE;

  public readonly placeholderPreviewLeft$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? '' : `${value}`))
  );

  public readonly placeholderPreviewRight$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? PLACEHOLDER : `${PLACEHOLDER.slice(value.length)}`))
  );

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue.slice(0, MAX_LENGTH_INPUT_VALUE));
  }

  public writeValue(newValue: any): void {
    if (isEmpty(newValue)) {
      this.setValue('');
      return;
    }

    if (!Array.isArray(newValue)) {
      throw new Error('[InputDateRangeNewComponent] value in not array in writeValue');
    }

    const dateFirst: Date = newValue[0];
    const dateSecond: Date = newValue[1];

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

    if (serializedValue.length < MAX_LENGTH_INPUT_VALUE) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const datePartFirst: string = serializedValue.slice(0, SIZE_PLACEHOLDER_DATE);
    const datePartSecond: string = serializedValue.slice(SIZE_PLACEHOLDER_DATE + 2).trim();

    const dateFirst: Date = this.getParsedDate(datePartFirst);
    const dateSecond: Date = this.getParsedDate(datePartSecond);

    const range: [Date, Date] = dateFirst < dateSecond ? [dateFirst, dateSecond] : [dateSecond, dateFirst];

    onChangeCallback(range);
    this.setValue(serializedValue);
  }
}
