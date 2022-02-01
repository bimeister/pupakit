import { InjectionToken } from '@angular/core';
import { TabsServiceBase } from '../../declarations/classes/abstract/tabs-service-base.abstract';

export const STEPPER_CONTAINER_STATE_SERVICE_TOKEN: InjectionToken<TabsServiceBase<unknown>> = new InjectionToken<
  TabsServiceBase<unknown>
>('STEPPER_CONTAINER_STATE_SERVICE_TOKEN');
