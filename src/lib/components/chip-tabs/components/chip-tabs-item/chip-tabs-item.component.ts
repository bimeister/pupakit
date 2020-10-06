import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/abstract/tabs-container-item.abstract';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsItemComponent extends TabsContainerItem {
  constructor(protected readonly changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
