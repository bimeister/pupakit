import { InjectionToken } from '@angular/core';
import { DropdownMenuService } from '../../declarations/interfaces/dropdown-menu-service.interface';

export const DROPDOWN_MENU_SERVICE_TOKEN: InjectionToken<DropdownMenuService> = new InjectionToken<DropdownMenuService>(
  'DROPDOWN_MENU_SERVICE_TOKEN'
);
