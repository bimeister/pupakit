import { InjectionToken } from '@angular/core';

import { AlertsContainerData } from '../../declarations/interfaces/alerts-container-data.interface';

export const ALERTS_CONTAINER_DATA_TOKEN: InjectionToken<AlertsContainerData> = new InjectionToken<AlertsContainerData>(
  'ALERTS_CONTAINER_DATA_TOKEN'
);
