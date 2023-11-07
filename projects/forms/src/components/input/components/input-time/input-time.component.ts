import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TimeDigitFormatPipe } from '@bimeister/pupakit.common';
import { isEmpty, isNil } from '@bimeister/utilities';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { InputDateTimeHelper } from '../../../../declarations/classes/input-date-time-helper.class';
import { isDate } from '../../../../declarations/functions/is-date.function';
import { ValueType } from '../../../../declarations/types/input-value.type';
import { NumericParsedTimeData } from '../../../../declarations/types/numeric-parsed-time-data.type';
import { OnChangeCallback } from '../../../../declarations/types/on-change-callback.type';

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;
const MAX_SECONDS: number = 59;

const DATE_FORMAT: string = 'HH:mm';

@Component({
  selector: 'pupa-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['./input-time.component.scss'],
  providers: [TimeDigitFormatPipe, DatePipe],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTimeComponent extends InputBase<ValueType> implements OnDestroy {
  public readonly timeMask: string = '00:00';
  public readonly maxLengthInputValue: number = this.timeMask.length;

  constructor(private readonly datePipe: DatePipe, ngControl: NgControl) {
    super(ngControl);
    this.leftIcon$.next('app-clock');
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    const truncatedValue: string = serializedValue.slice(0, this.maxLengthInputValue);
    this.value$.next(truncatedValue);
  }

  public reset(): void {
    this.updateValue('');
    this.inputElementRef.nativeElement.focus();
  }

  public writeValue(newValue: ValueType): void {
    if (isNil(newValue) || !isDate(newValue)) {
      this.setValue('');
      return;
    }

    const serializedValue: string = String(newValue);

    const parsedValue: string = this.datePipe.transform(serializedValue, DATE_FORMAT);
    this.setValue(parsedValue);
  }

  public handleChangedValue(onChangeCallback: OnChangeCallback<unknown>, value: ValueType): void {
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

    const date: Date = this.getDateFromSerializedTime(serializedValue);

    onChangeCallback(date);
    this.setValue(serializedValue);
  }

  private getDateFromSerializedTime(value: string): Date {
    const parseTimeData: NumericParsedTimeData = InputDateTimeHelper.getParsedNumericTimeData(value);

    if (!this.isCorrectParsedNumericData(parseTimeData)) {
      return new Date(undefined);
    }

    const date: Date = new Date();
    date.setHours(parseTimeData.hours);
    date.setMinutes(parseTimeData.minutes);
    date.setSeconds(parseTimeData.seconds);

    return date;
  }

  private isCorrectParsedNumericData({ hours, minutes, seconds }: NumericParsedTimeData): boolean {
    const isTimePartCorrect = (value: number, maxValue: number): boolean => value >= 0 && value <= maxValue;
    const isCorrectHours: boolean = isTimePartCorrect(hours, MAX_HOURS);
    const isCorrectMinutes: boolean = isTimePartCorrect(minutes, MAX_MINUTES);
    const isCorrectSeconds: boolean = isTimePartCorrect(seconds, MAX_SECONDS);

    return isCorrectHours && isCorrectMinutes && isCorrectSeconds;
  }
}
