import { InjectionToken } from '@angular/core';
import { DaySelectorConfig } from '../../declarations/interfaces/day-selector-config.interface';

export const DAY_SELECTOR_CONFIG_TOKEN: InjectionToken<DaySelectorConfig> = new InjectionToken<DaySelectorConfig>(
  'DAY_SELECTOR_CONFIG_TOKEN'
);
