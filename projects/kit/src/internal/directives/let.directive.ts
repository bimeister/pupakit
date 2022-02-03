import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

type LetContext<T> = T & { pupaLet: T };

@Directive({
  selector: '[pupaLet]',
})
export class LetDirective<T = unknown> implements OnChanges {
  @Input()
  public pupaLet: T;

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<LetContext<T>>
  ) {}

  public ngOnChanges(): void {
    this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView<LetContext<T>>(this.templateRef, {
      ...this.pupaLet,
      pupaLet: this.pupaLet,
    });
  }
}
