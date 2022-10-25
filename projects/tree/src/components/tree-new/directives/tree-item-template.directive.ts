import { Directive, TemplateRef } from '@angular/core';
import { TreeItemTemplateContext } from '../../../declarations/interfaces/tree-item-template-context.interface';

@Directive({
  selector: '[pupaTreeItemTemplate]',
})
export class TreeItemTemplateDirective<T> {
  constructor(public readonly templateRef: TemplateRef<TreeItemTemplateContext<T>>) {}
}
