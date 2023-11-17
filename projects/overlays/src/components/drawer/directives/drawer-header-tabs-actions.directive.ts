import { Directive, Input, OnChanges, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[pupaDrawerHeaderTabsActions]',
})
export class DrawerHeaderTabsActionsDirective implements OnChanges {
  @Input() public pupaDrawerHeaderTabsActions: boolean;

  public readonly isDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public ngOnChanges(): void {
    this.isDisplayed$.next(this.pupaDrawerHeaderTabsActions);
  }
}
