import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TabsContainer } from '../../../../../internal/declarations/classes/abstract/tabs-container.abstract';
import { VerticalTabsStateService } from '../../services/vertical-tabs-state.service';

@Component({
  selector: 'pupa-vertical-tabs',
  templateUrl: './vertical-tabs.component.html',
  styleUrls: ['./vertical-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VerticalTabsStateService]
})
export class VerticalTabsComponent extends TabsContainer {
  constructor(verticalTabsStateService: VerticalTabsStateService) {
    super(verticalTabsStateService);
  }
}
