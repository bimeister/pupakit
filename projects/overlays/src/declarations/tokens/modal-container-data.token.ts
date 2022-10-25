import { InjectionToken } from '@angular/core';

import { ModalContainerData } from '../../declarations/interfaces/modal-container-data.interface';

export const MODAL_CONTAINER_DATA_TOKEN: InjectionToken<ModalContainerData<unknown>> = new InjectionToken<
  ModalContainerData<unknown>
>('MODAL_CONTAINER_DATA_TOKEN');
