import { TemplateRef } from '@angular/core';

export interface TabTemplateRef<T> {
  templateRef: TemplateRef<unknown>;
  name: T;
  isActive: boolean;
}
