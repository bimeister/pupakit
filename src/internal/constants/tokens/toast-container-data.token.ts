import { InjectionToken } from '@angular/core';

import { ToastContainerData } from '../../declarations/interfaces/toast-container-data.interface';

export const TOAST_CONTAINER_DATA_TOKEN: InjectionToken<ToastContainerData> = new InjectionToken<ToastContainerData>(
  'TOAST_CONTAINER_DATA_TOKEN'
);
