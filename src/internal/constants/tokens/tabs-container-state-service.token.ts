import { InjectionToken } from '@angular/core';
import { TabsServiceBase } from '../../declarations/classes/abstract/tabs-service-base.abstract';

export const TABS_CONTAINER_STATE_SERVICE_TOKEN: InjectionToken<TabsServiceBase<unknown>> = new InjectionToken<
  TabsServiceBase<unknown>
>('TABS_CONTAINER_STATE_SERVICE_TOKEN');
