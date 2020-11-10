import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isEmpty, isNil } from '@meistersoft/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../../internal/declarations/classes/abstract/input-date-time-base.abstract';
import { ParsedTimeData } from '../../../../../internal/declarations/interfaces/parsed-time-data.interface';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const PLACEHOLDER: string = '00:00:00';
const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;

const DATE_FORMAT: string = 'HH:mm:ss';

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;
const MAX_SECONDS: number = 59;

@Component({
  selector: 'pupa-input-time-seconds',
  templateUrl: './input-time-seconds.component.html',
  styleUrls: ['./input-time-seconds.component.scss'],
  providers: [TimeFormatPipe, DatePipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTimeSecondsComponent extends InputDateTimeBase {
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

    const { hours, minutes, seconds }: ParsedTimeData = this.inputDateTimeStateService.getParsedTimeData(
      serializedValue
    );
    const parsedHours: number = Number(hours);
    const parsedMinutes: number = Number(minutes);
    const parsedSeconds: number = Number(seconds);

    const isCorrectHours: boolean = parsedHours >= 0 && parsedHours <= MAX_HOURS;
    const isCorrectMinutes: boolean = parsedMinutes >= 0 && parsedMinutes <= MAX_MINUTES;
    const isCorrectSeconds: boolean = parsedSeconds >= 0 && parsedSeconds <= MAX_SECONDS;

    if (!isCorrectHours || !isCorrectMinutes || !isCorrectSeconds) {
      onChangeCallback(new Date(undefined));
      this.setValue(serializedValue);
      return;
    }

    const date: Date = new Date();

    date.setHours(parsedHours);
    date.setMinutes(parsedMinutes);
    date.setSeconds(parsedSeconds);

    onChangeCallback(date);
    this.setValue(serializedValue);
  }
}
