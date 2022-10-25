import { InjectionToken } from '@angular/core';
import { DropdownContainerData } from '../../declarations/interfaces/dropdown-container-data.interface';

export const DROPDOWN_CONTAINER_DATA_TOKEN: InjectionToken<DropdownContainerData<unknown>> = new InjectionToken<
  DropdownContainerData<unknown>
>('DROPDOWN_CONTAINER_DATA_TOKEN');
