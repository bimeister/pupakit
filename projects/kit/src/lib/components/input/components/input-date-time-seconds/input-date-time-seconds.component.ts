import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../../internal/declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { TimeDigitFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { NumericParsedTimeData } from '../../../../../internal/declarations/types/numeric-parsed-time-data.type';
import { InputDateTimeHelper } from '../../../../../internal/declarations/classes/input-date-time-helper.class';

const PLACEHOLDER_TIME: string = '00:00:00';
const PLACEHOLDER_DATE: string = '00.00.0000';
const PLACEHOLDER: string = `${PLACEHOLDER_DATE} ${PLACEHOLDER_TIME}`;

const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;
const SIZE_PLACEHOLDER_DATE: number = PLACEHOLDER_DATE.length;

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;
const MAX_SECONDS: number = 59;

const DATE_FORMAT: string = 'dd.MM.yyyy HH:mm:ss';

@Component({
  selector: 'pupa-input-date-time-seconds',
  templateUrl: './input-date-time-seconds.component.html',
  styleUrls: ['./input-date-time-seconds.component.scss'],
  providers: [TimeDigitFormatPipe, DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateTimeSecondsComponent extends InputDateTimeBase {
  public readonly hours$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(SIZE_PLACEHOLDER_DATE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length >= 2 ? Number(value.slice(0, 2)) : -1)),
    filterNotNil(),
    filter((hours: number) => hours <= MAX_HOURS)
  );

  public readonly minutes$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(SIZE_PLACEHOLDER_DATE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length >= 5 ? Number(value.slice(3, 5)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_MINUTES)
  );

  public readonly seconds$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(SIZE_PLACEHOLDER_DATE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length === 8 ? Number(value.slice(6)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_SECONDS)
  );

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

    if (serializedValue.length < MAX_LENGTH_INPUT_VALUE) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const datePart: string = serializedValue.slice(0, SIZE_PLACEHOLDER_DATE);
    const timePart: string = serializedValue.slice(SIZE_PLACEHOLDER_DATE).trim();

    const date: Date = this.getParsedDate(datePart);

    if (isNil(date)) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const { hours, minutes, seconds }: NumericParsedTimeData = InputDateTimeHelper.getParsedNumericTimeData(timePart);

    const isCorrectHours: boolean = hours >= 0 && hours <= MAX_HOURS;
    const isCorrectMinutes: boolean = minutes >= 0 && minutes <= MAX_MINUTES;
    const isCorrectSeconds: boolean = seconds >= 0 && seconds <= MAX_SECONDS;

    if (!isCorrectHours || !isCorrectMinutes || !isCorrectSeconds) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    onChangeCallback(date);
    this.setValue(serializedValue);
  }
}
