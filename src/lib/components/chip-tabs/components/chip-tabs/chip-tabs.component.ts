import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';

import { TabsContainer } from '../../../../../internal/declarations/classes/abstract/tabs-container.abstract';
import { ChipTabsItemComponent } from '../chip-tabs-item/chip-tabs-item.component';

@Component({
  selector: 'pupa-chip-tabs',
  templateUrl: './chip-tabs.component.html',
  styleUrls: ['./chip-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsComponent extends TabsContainer implements AfterViewInit, OnDestroy {
  @Input() protected isMultiSelectionEnabled: boolean = false;

  @Output() protected readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() protected readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(ChipTabsItemComponent, {
    descendants: false
  })
  protected readonly tabsList: QueryList<ChipTabsItemComponent>;

  constructor() {
    super();
  }
}
