import { Uuid } from '../types/uuid.type';

export interface Breadcrumb {
  name: string;
  id: Uuid;
  routerLink: string;
}
