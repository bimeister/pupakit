import { Attribute, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';
import { VerticalTabsKind } from '../../../../../internal/declarations/types/vertical-tabs-kind.type';
import { VerticalTabsStateService } from '../../services/vertical-tabs-state.service';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent extends TabsContainerItem {
  constructor(
    @Attribute('kind') public readonly kind: VerticalTabsKind = 'rounded',
    verticalTabsStateService: VerticalTabsStateService
  ) {
    super(verticalTabsStateService);
  }
}
