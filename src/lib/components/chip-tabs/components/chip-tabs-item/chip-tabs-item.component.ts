import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';
import { ChipTabsStateService } from '../../services/chip-tabs-state.service';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ChipTabsItemComponent extends TabsContainerItem {
  constructor(chipTabsStateService: ChipTabsStateService) {
    super(chipTabsStateService);
  }
}
