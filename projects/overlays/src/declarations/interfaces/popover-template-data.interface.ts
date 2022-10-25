import { TemplateRef } from '@angular/core';

export interface PopoverTemplateData<C> {
  templateRef?: TemplateRef<C>;
  templateContext?: C;
}
