import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';

@Component({
  selector: 'pupa-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent extends InputBase<ValueType> {
  @Input() public readonly withReset: boolean = false;

  public readonly rightPadding$: Observable<number> = this.getRightPadding([this.isInvalid$, this.isVisibleReset$]);

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public reset(): void {
    this.updateValue('');
  }
}
