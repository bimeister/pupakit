import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { InputBase } from '../../../../declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../declarations/types/input-value.type';

@Component({
  selector: 'pupa-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent extends InputBase<ValueType> implements AfterViewInit {
  public ngAfterViewInit(): void {
    if (this.inputElementRef.nativeElement.shadowRoot) {
      const input = this.inputElementRef.nativeElement.shadowRoot?.querySelector('input');
      input.setAttribute('delegatesFocus', '');
    }
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public reset(): void {
    this.updateValue('');
    this.inputElementRef.nativeElement.focus();
  }
}
