import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import { TabsContainer } from '../../../../../internal/declarations/classes/abstract/tabs-container.abstract';
import { VerticalTabsItemComponent } from '../vertical-tabs-item/vertical-tabs-item.component';

@Component({
  selector: 'pupa-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsComponent extends TabsContainer implements AfterViewInit, OnDestroy {
  @Input() protected isMultiSelectionEnabled: boolean = false;

  @Output() protected readonly selectedTabIndexes: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() protected readonly latestClickedTabIndex: EventEmitter<number> = new EventEmitter<number>();

  @ContentChildren(VerticalTabsItemComponent, { descendants: true })
  protected readonly tabsList: QueryList<VerticalTabsItemComponent>;

  constructor() {
    super();
  }
}
