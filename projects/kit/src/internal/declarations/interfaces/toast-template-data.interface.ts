import { TemplateRef } from '@angular/core';

export interface ToastTemplateData<C> {
  templateRef: TemplateRef<C>;
  templateContext?: C;
  autoCloseTimeMs?: number;
}
