import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TabsContainer } from '../../../../../internal/declarations/classes/abstract/tabs-container.abstract';
import { ChipTabsStateService } from '../../services/chip-tabs-state.service';

@Component({
  selector: 'pupa-chip-tabs',
  templateUrl: './chip-tabs.component.html',
  styleUrls: ['./chip-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ChipTabsStateService]
})
export class ChipTabsComponent extends TabsContainer {
  constructor(chipTabsStateService: ChipTabsStateService) {
    super(chipTabsStateService);
  }
}
