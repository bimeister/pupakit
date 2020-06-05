import { Attribute, ChangeDetectionStrategy, Component, Host, ViewEncapsulation } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/tabs-container-item.class';
import { TabsContainer } from '../../../../../internal/declarations/classes/tabs-container.class';
import { VertiacalTabsKind } from '../../../../../internal/declarations/types/vertical-tabs-kind.type';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent extends TabsContainerItem<VerticalTabsItemComponent> {
  constructor(
    @Attribute('kind') public readonly kind: VertiacalTabsKind = 'rounded',
    @Host() protected readonly tabsContainer: TabsContainer
  ) {
    super(tabsContainer);
  }
}
