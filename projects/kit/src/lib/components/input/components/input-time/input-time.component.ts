import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { TimeDigitFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { NgControl } from '@angular/forms';
import { NumericParsedTimeData } from '../../../../../internal/declarations/types/numeric-parsed-time-data.type';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { InputDateTimeHelper } from '../../../../../internal/declarations/classes/input-date-time-helper.class';

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
export class InputTimeComponent extends InputBase<ValueType> implements OnChanges, OnDestroy {
  public readonly maxLengthInputValue: number = DATE_FORMAT.length;

  public readonly rightPaddingPx$: Observable<number> = this.getRightPadding([this.isInvalid$, this.isVisibleReset$]);

  constructor(private readonly datePipe: DatePipe, ngControl: NgControl) {
    super(ngControl);
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
