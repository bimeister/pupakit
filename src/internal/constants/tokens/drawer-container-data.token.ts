import { InjectionToken } from '@angular/core';

import { DrawerContainerData } from '../../declarations/interfaces/drawer-container-data.interface';

export const DRAWER_CONTAINER_DATA_TOKEN: InjectionToken<DrawerContainerData<unknown>> = new InjectionToken<
  DrawerContainerData<unknown>
>('DRAWER_CONTAINER_DATA_TOKEN');
