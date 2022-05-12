import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

type LetContext<T = unknown> = T & { pupaLet: T };

@Directive({
  selector: '[pupaLet]',
})
export class LetDirective<T = unknown> implements OnChanges {
  @Input()
  public pupaLet: T;

  private context: LetContext<unknown> = { pupaLet: null };

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<LetContext<T>>
  ) {
    this.viewContainerRef.createEmbeddedView<unknown>(this.templateRef, this.context);
  }

  public ngOnChanges(): void {
    Object.assign(this.context, this.pupaLet);
    this.context.pupaLet = this.pupaLet;
  }
}
