import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isEmpty, isNil } from '@meistersoft/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputDateTimeBase } from '../../../../../internal/declarations/classes/abstract/input-date-time-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const PLACEHOLDER: string = '00:00:00';
const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;

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
}
