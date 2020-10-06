import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';
import { VertiacalTabsKind } from '../../../../../internal/declarations/types/vertical-tabs-kind.type';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent extends TabsContainerItem {
  constructor(
    @Attribute('kind') public readonly kind: VertiacalTabsKind = 'rounded',
    protected readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(changeDetectorRef);
  }
}
