import { ChangeDetectionStrategy, Component, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { ComponentChanges } from '../../../../../internal/api';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';

@Component({
  selector: 'pupa-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent extends InputBase<ValueType> {

  public readonly off: string = this.browserService.isChrome ? 'new-password' : 'off';

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processAutocompleteChange(changes?.autocomplete);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  private processAutocompleteChange
}
