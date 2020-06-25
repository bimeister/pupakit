import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
  ViewEncapsulation
} from '@angular/core';

import { TabsContainer } from '../../../../../internal/declarations/classes/tabs-container.class';
import { VerticalTabsItemComponent } from '../vertical-tabs-item/vertical-tabs-item.component';

@Component({
  selector: 'pupa-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsComponent extends TabsContainer<VerticalTabsItemComponent>
  implements AfterViewInit, OnDestroy {
  @ContentChildren(VerticalTabsItemComponent, {
    descendants: false
  })
  protected readonly tabsList: QueryList<VerticalTabsItemComponent>;
}
