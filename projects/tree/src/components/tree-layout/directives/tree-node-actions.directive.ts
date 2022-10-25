import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[pupaTreeNodeActions]',
})
export class TreeNodeActionsDirective implements OnChanges {
  @Input() public pupaTreeNodeActions: boolean | string;

  public readonly isDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public ngOnChanges(): void {
    this.isDisplayed$.next(Boolean(this.pupaTreeNodeActions));
  }
}
