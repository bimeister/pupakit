import { InjectionToken } from '@angular/core';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';

export const DROPDOWN_CONTEXT_ID_TOKEN: InjectionToken<Uuid> = new InjectionToken<Uuid>('DROPDOWN_CONTEXT_ID_TOKEN');
