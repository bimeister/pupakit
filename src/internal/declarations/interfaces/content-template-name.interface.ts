import { TemplateRef } from '@angular/core';

export interface ContentTemplateNameDirective {
  templateRef: TemplateRef<unknown>;

  getTemplateName(): string;
}
