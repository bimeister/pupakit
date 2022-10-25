import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/button-group-state-service.token';
import { ButtonGroupStateService } from '../../services/button-group-state.service';

@Component({
  selector: 'pupa-button-group-container',
  templateUrl: './button-group-container.component.html',
  styleUrls: ['./button-group-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN,
      useClass: ButtonGroupStateService,
    },
  ],
})
export class ButtonGroupContainerComponent {}
