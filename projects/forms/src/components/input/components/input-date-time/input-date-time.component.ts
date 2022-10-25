import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TimeDigitFormatPipe } from '@bimeister/pupakit.common';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../declarations/classes/abstract/input-date-time-base.abstract';
import { InputDateTimeHelper } from '../../../../declarations/classes/input-date-time-helper.class';
import { ValueType } from '../../../../declarations/types/input-value.type';
import { NumericParsedTimeData } from '../../../../declarations/types/numeric-parsed-time-data.type';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';

const TIME_MASK: string = '00:00';
const DATE_MASK: string = '00.00.0000';
const DATE_MASK_SIZE: number = DATE_MASK.length;

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;

const DATE_FORMAT: string = 'dd.MM.yyyy HH:mm';

@Component({
  selector: 'pupa-input-date-time',
  templateUrl: './input-date-time.component.html',
  styleUrls: ['./input-date-time.component.scss'],
  providers: [TimeDigitFormatPipe, DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateTimeComponent extends InputDateTimeBase {
  public readonly dateTimeMask: string = `${DATE_MASK} ${TIME_MASK}`;
  public readonly maxLengthInputValue: number = this.dateTimeMask.length;

  public readonly hours$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(DATE_MASK_SIZE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length >= 2 ? Number(value.slice(0, 2)) : -1)),
    filterNotNil(),
    filter((hours: number) => hours <= MAX_HOURS)
  );

  public readonly minutes$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(DATE_MASK_SIZE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length === 5 ? Number(value.slice(3)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_MINUTES)
  );

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue.slice(0, this.maxLengthInputValue));
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

    const datePart: string = serializedValue.slice(0, DATE_MASK_SIZE);
    const timePart: string = serializedValue.slice(DATE_MASK_SIZE).trim();

    const date: Date = this.getParsedDate(datePart);

    if (isNil(date)) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const { hours, minutes }: NumericParsedTimeData = InputDateTimeHelper.getParsedNumericTimeData(timePart);

    const isCorrectHours: boolean = hours >= 0 && hours <= MAX_HOURS;
    const isCorrectMinutes: boolean = minutes >= 0 && minutes <= MAX_MINUTES;

    if (!isCorrectHours || !isCorrectMinutes) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    onChangeCallback(date);
    this.setValue(serializedValue);
  }
}
