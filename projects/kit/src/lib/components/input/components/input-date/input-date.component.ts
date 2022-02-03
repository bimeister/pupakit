import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { filterNotNil, isEmpty, isNil } from '@bimeister/utilities';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, withLatestFrom } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../../internal/declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const PLACEHOLDER: string = '00.00.0000';
const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;

const DATE_FORMAT: string = 'dd.MM.yyyy';

@Component({
  selector: 'pupa-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [TimeFormatPipe, DatePipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent extends InputDateTimeBase {
  public readonly date$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    filter((value: string) => isEmpty(value) || value.length === MAX_LENGTH_INPUT_VALUE),
    distinctUntilChanged(),
    map((value: string) => this.getParsedDate(value)),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableEndDate]]: [Date, [boolean, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date]]) => date)
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

    if (serializedValue.length < MAX_LENGTH_INPUT_VALUE) {
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
