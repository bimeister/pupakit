import { ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';

import { TabsContainer } from '../../../../../internal/declarations/classes/tabs-container.class';
import { ChipTabsItemComponent } from '../chip-tabs-item/chip-tabs-item.component';

@Component({
  selector: 'pupa-chip-tabs',
  templateUrl: './chip-tabs.component.html',
  styleUrls: ['./chip-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsComponent extends TabsContainer<ChipTabsItemComponent> {
  @ContentChildren(ChipTabsItemComponent) protected readonly tabsList: QueryList<ChipTabsItemComponent>;
}
