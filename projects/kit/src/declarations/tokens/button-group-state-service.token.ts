import { InjectionToken } from '@angular/core';
import { TabsServiceBase } from '../classes/abstract/tabs-service-base.abstract';

export const BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN: InjectionToken<TabsServiceBase<unknown>> = new InjectionToken<
  TabsServiceBase<unknown>
>('BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN');
