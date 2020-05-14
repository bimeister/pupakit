import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { TabsContainerItem } from '../../../../../internal/declarations/classes/tabs-container-item.class';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsItemComponent extends TabsContainerItem implements OnInit, OnDestroy {
  constructor(protected readonly changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }
}
