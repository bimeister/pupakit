import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { STEPPER_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/stepper-container-state-service.token';
import { StepperStateService } from '../../services/stepper-state.service';

@Component({
  selector: 'pupa-stepper-container',
  templateUrl: './stepper-container.component.html',
  styleUrls: ['./stepper-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: STEPPER_CONTAINER_STATE_SERVICE_TOKEN,
      useClass: StepperStateService,
    },
  ],
})
export class StepperContainerComponent {}
