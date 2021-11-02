import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { TabsStateService } from '../../services/tabs-state.service';
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/tabs-container-state-service.token';

@Component({
  selector: 'pupa-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TABS_CONTAINER_STATE_SERVICE_TOKEN,
      useClass: TabsStateService
    }
  ]
})
export class TabsContainerComponent {}
