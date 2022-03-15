import { InjectionToken } from '@angular/core';
import { PopoverContainerData } from '../../declarations/interfaces/popover-container-data.interface';

export const POPOVER_CONTAINER_DATA_TOKEN: InjectionToken<PopoverContainerData> =
  new InjectionToken<PopoverContainerData>('POPOVER_CONTAINER_DATA_TOKEN');
