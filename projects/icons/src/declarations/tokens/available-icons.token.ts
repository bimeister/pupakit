import { InjectionToken } from '@angular/core';
import { IconRegistry } from '../types/icon-registry.type';

export const AVAILABLE_ICONS_TOKEN: InjectionToken<IconRegistry> = new InjectionToken<IconRegistry>(
  'AVAILABLE_ICONS_TOKEN'
);
