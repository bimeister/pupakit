import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';

const DECIMAL_DOT: string = '.';
const DECIMAL_COMMA: string = ',';

const CHAR_HYPHEN_MINUS: string = '\u002D';

const NEGATIVE_SIGN_REGEX: RegExp = /^\D*[−\-–—]/;
const NOT_A_NUMBER_AND_DOT_REGEX: RegExp = /[^\d^.]/g;
const DOT_REGEX: RegExp = /[.]/g;

@Component({
  selector: 'pupa-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends InputBase<ValueType> {
  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public reset(): void {
    this.updateValue('');
    this.inputElementRef.nativeElement.focus();
  }

  public updateTextValueToNumberViewValue(updatedValue: ValueType): void {
    const value: string = isNil(updatedValue) ? '' : String(updatedValue);

    const hasNegativeSign: boolean = !isNil(value.match(NEGATIVE_SIGN_REGEX));

    const serializedValue: string = this.serializeValue(value);

    const updatedNumberValue: string = (hasNegativeSign ? CHAR_HYPHEN_MINUS : '') + serializedValue;

    this.inputElementRef.nativeElement.value = updatedNumberValue;
    this.updateValue(serializedValue && serializedValue !== DECIMAL_DOT ? updatedNumberValue : '');
  }

  private serializeValue(value: string): string {
    const serializedValue: string = value.replace(DECIMAL_COMMA, DECIMAL_DOT).replace(NOT_A_NUMBER_AND_DOT_REGEX, '');

    const firstDotIndex: number = serializedValue.indexOf(DECIMAL_DOT);

    if (firstDotIndex !== -1) {
      const integerPartWithFirstDot: string = serializedValue.substring(0, firstDotIndex) + DECIMAL_DOT;

      const decimalPart: string = serializedValue.substring(firstDotIndex + 1).replace(DOT_REGEX, '');

      return integerPartWithFirstDot + decimalPart;
    }

    return serializedValue;
  }
}
