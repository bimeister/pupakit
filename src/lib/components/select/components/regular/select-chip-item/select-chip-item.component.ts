import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SelectItemBase } from '../../../../../../internal/declarations/classes/abstract/select-item-base.abstract';
import { SelectStateService } from '../../../services/select-state.service';

@Component({
  selector: 'pupa-select-chip-item',
  templateUrl: './select-chip-item.component.html',
  styleUrls: ['./select-chip-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChipItemComponent<T> extends SelectItemBase<T> {
  @Input() public value: T = null;
  @Input() public isDisabled: boolean = false;

  @Input() public iconName: string;
  @Input() public withClose: boolean = true;
  @Output() public readonly closeClick: EventEmitter<void> = new EventEmitter();

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
