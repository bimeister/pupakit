import { InjectionToken } from '@angular/core';
import { ButtonGroupStateService } from '../../../lib/components/button-group/services/button-group-state.service';

export const BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN: InjectionToken<ButtonGroupStateService> =
  new InjectionToken<ButtonGroupStateService>('BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN');
