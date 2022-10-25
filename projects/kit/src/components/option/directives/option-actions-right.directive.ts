import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[pupaOptionActionsRight]',
})
export class OptionActionsRightDirective implements OnChanges {
  @Input() public pupaOptionActionsRight: boolean;

  public readonly isDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public ngOnChanges(): void {
    this.isDisplayed$.next(this.pupaOptionActionsRight);
  }
}
