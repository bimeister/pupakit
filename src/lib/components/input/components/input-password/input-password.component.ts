import { ChangeDetectionStrategy, Component, Optional, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { BrowserService } from '../../../../../internal/shared/services/browser.service';

type PasswordAutocompleteOffValue = 'off' | 'new-password';

@Component({
  selector: 'pupa-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [BrowserService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent extends InputBase<ValueType> {
  public readonly offValue: PasswordAutocompleteOffValue = this.browserService.isChrome ? 'new-password' : 'off';

  constructor(protected readonly browserService: BrowserService, @Optional() ngControl: NgControl) {
    super(browserService, ngControl);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }
}
