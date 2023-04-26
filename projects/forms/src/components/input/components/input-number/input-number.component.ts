import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';

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
    const prevValue: ValueType = this.value$.getValue();
    if (!prevValue || serializedValue) {
      this.value$.next(serializedValue);
    }
  }

  public reset(): void {
    this.updateValue('');
    this.inputElementRef.nativeElement.focus();
  }
}
