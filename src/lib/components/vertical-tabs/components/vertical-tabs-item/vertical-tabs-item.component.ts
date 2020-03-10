import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/tabs-container-item.class';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent extends TabsContainerItem {}
