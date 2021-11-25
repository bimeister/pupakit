import { TemplateRef } from '@angular/core';

export interface TabTemplateRef {
  templateRef: TemplateRef<unknown>;
  name: string;
  isActive: boolean;
}
