import { TemplateRef } from '@angular/core';

export interface ContentTemplateNameDirective<T> {
  templateRef: TemplateRef<unknown>;

  getTemplateName(): T;
}
