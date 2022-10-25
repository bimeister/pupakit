import { InjectionToken } from '@angular/core';
import { TooltipServiceDeclaration } from '../../declarations/interfaces/tooltip-service-declaration.interface';

export const TOOLTIP_SERVICE_TOKEN: InjectionToken<TooltipServiceDeclaration> =
  new InjectionToken<TooltipServiceDeclaration>('TOOLTIP_SERVICE_TOKEN');
