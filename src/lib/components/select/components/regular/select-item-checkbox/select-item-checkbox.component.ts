import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SelectItemBase } from '../../../../../../internal/declarations/classes/abstract/select-item-base.abstract';
import { SelectStateService } from '../../../services/select-state.service';

@Component({
  selector: 'pupa-select-item-checkbox',
  templateUrl: './select-item-checkbox.component.html',
  styleUrls: ['./select-item-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectItemCheckboxComponent<T> extends SelectItemBase<T> {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
