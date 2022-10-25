import { Uuid } from '@bimeister/pupakit.common';

export interface Breadcrumb {
  name: string;
  id: Uuid;
  routerLink: string;
}
