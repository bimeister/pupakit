import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerExpanded', [
      state('false', style({ width: 0 })),
      state('true', style({ width: `*` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out'))
    ])
  ]
})
export class DrawerComponent implements OnChanges {
  @Input() public isVisible: boolean = false;
  @Input() public destroyContentOnClose: boolean = true;

  /**
   * @description content wrapper CSS styles property
   * @example contentWidth = '300px'
   */
  @Input() public contentWidth: string = 'fit-content';

  public get isContentRendered(): boolean {
    return this.destroyContentOnClose ? this.shouldRenderContent : true;
  }

  public get isContentVisible(): boolean {
    return !this.shouldHideContent;
  }

  private shouldRenderContent: boolean = false;
  private shouldHideContent: boolean = true;

  public ngOnChanges(changes: SimpleChanges): void {
    this.processIsVisibleValueChange(changes.isVisible);
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const isCollapseAnimationDone: boolean = String(event.toState) === 'false';
    if (isCollapseAnimationDone) {
      this.shouldRenderContent = false;
      this.shouldHideContent = true;
    }
  }

  private processIsVisibleValueChange(change: SimpleChange): void {
    const drawerBecameVisible: boolean = !isNullOrUndefined(change) && change.currentValue === true;
    if (drawerBecameVisible) {
      this.shouldRenderContent = true;
      this.shouldHideContent = false;
    }
  }
}
