import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[demoExampleViewerPropertyDescription]',
})
export class ExampleViewerPropertyDescriptionDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
