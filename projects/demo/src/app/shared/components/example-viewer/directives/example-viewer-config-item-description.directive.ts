import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[demoExampleViewerConfigItemDescription]',
})
export class ExampleViewerConfigItemDescriptionDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
