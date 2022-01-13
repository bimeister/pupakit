import { InjectionToken } from '@angular/core';

import { AlertModuleConfig } from '../../declarations/interfaces/alert-module-config.interface';

export const ALERT_MODULE_CONFIG_TOKEN: InjectionToken<AlertModuleConfig> = new InjectionToken<AlertModuleConfig>(
  'ALERT_MODULE_CONFIG_TOKEN'
);
