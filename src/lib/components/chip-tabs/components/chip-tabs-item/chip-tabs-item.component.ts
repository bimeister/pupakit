import { ChangeDetectionStrategy, Component, Host } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/tabs-container-item.class';
import { ChipTabsComponent } from '../chip-tabs/chip-tabs.component';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsItemComponent extends TabsContainerItem<ChipTabsItemComponent> {
  constructor(@Host() protected readonly tabsContainer: ChipTabsComponent) {
    super(tabsContainer);
  }
}
