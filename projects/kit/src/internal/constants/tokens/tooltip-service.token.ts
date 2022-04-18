import { InjectionToken } from '@angular/core';
import { TooltipService } from '../../declarations/interfaces/tooltip-service.interface';

export const TOOLTIP_SERVICE_TOKEN: InjectionToken<TooltipService> = new InjectionToken<TooltipService>(
  'TOOLTIP_SERVICE_TOKEN'
);
