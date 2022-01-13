import { TemplateRef } from '@angular/core';

export interface AlertTemplateData<C> {
  templateRef?: TemplateRef<C>;
  templateContext?: C;
  autoCloseTimeMs?: number;
}
