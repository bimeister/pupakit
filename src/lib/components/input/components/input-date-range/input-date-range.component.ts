import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { getRangeEndDate } from '../../../../../internal/helpers/get-range-end-date.helper';
import { getRangeStartDate } from '../../../../../internal/helpers/get-range-start-date.helper';

@Component({
  selector: 'pupa-input-date-range',
  templateUrl: './input-date-range.component.html',
  styleUrls: ['./input-date-range.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateRangeComponent extends InputBase<ValueType> {
  public getRangeStart(value: ValueType): Date {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));

    if (Array.isArray(parsedValue)) {
      return getRangeStartDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeStartDate(value);
  }

  public getRangeEnd(value: ValueType): Date {
    const parsedValue: Date[] = JSON.parse(JSON.stringify(value));
    if (Array.isArray(parsedValue)) {
      return getRangeEndDate(parsedValue);
    }
    if (!Array.isArray(value)) {
      return null;
    }
    return getRangeEndDate(value);
  }

  public setValue(newValue: ValueType): void {
    const serializedValue: ValueType = isNil(newValue)
      ? null
      : [new Date(String(newValue[0])), new Date(String(newValue[1]))];

    this.value$.next(serializedValue);
  }
}
