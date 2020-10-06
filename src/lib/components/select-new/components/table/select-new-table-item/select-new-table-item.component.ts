import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { SelectNewStateService } from '../../../services/select-new-state.service';
import { SelectItemBase } from './../../../../../../internal/declarations/classes/abstract/select-item-base.abstract';

@Component({
  selector: 'pupa-select-new-table-item',
  templateUrl: './select-new-table-item.component.html',
  styleUrls: ['./select-new-table-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewTableItemComponent<T> extends SelectItemBase<T> {
  @Input() public value: T = null;

  constructor(selectNewStateService: SelectNewStateService<T>) {
    super(selectNewStateService);
  }
}
