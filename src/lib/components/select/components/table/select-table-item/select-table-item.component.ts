import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { SelectStateService } from '../../../services/select-state.service';
import { SelectItemBase } from './../../../../../../internal/declarations/classes/abstract/select-item-base.abstract';

@Component({
  selector: 'pupa-select-table-item',
  templateUrl: './select-table-item.component.html',
  styleUrls: ['./select-table-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTableItemComponent<T> extends SelectItemBase<T> {
  @Input() public value: T = null;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
