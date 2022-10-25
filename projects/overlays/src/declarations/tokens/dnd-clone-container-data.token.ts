import { InjectionToken } from '@angular/core';
import { DndCloneContainerData } from '../interfaces/dnd-clone-container-data.interface';

export const DND_CLONE_CONTAINER_DATA_TOKEN: InjectionToken<DndCloneContainerData<unknown>> = new InjectionToken<
  DndCloneContainerData<unknown>
>('DND_CLONE_CONTAINER_DATA_TOKEN');
