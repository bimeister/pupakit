import { Params } from '@angular/router';

export interface Tab {
  name: string;
  route: string;
  iconName?: string;
  iconSrc?: string;
  queryParams?: Params;
  removeExistingQueryParams?: boolean;
}
