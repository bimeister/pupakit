import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SelectStateService } from '../../../services/select-state.service';
import { SelectItemBase } from './../../../../../../internal/declarations/classes/abstract/select-item-base.abstract';

@Component({
  selector: 'pupa-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectItemComponent<T> extends SelectItemBase<T> {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
