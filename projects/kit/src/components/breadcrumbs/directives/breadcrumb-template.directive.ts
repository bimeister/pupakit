import { Directive, TemplateRef } from '@angular/core';
import { BreadcrumbContext } from '../../../declarations/interfaces/breadcrumb-context.interface';

@Directive({
  selector: '[pupaBreadcrumbTemplate]',
})
export class PupaBreadcrumbTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<BreadcrumbContext>) {}
}
