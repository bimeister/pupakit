import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export type DrawerFloat = 'left' | 'right';

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
  private shouldRenderContent: boolean = false;
  private shouldHideContent: boolean = true;

  @Input() public isVisible: boolean = false;
  @Input() public float: DrawerFloat = 'right';
  @Input() public destroyContentOnClose: boolean = true;
  @Input() public withOverlay: boolean = false;
  @Input() public closeByEsc: boolean = true;
  @Output() public readonly close: EventEmitter<void> = new EventEmitter<void>();

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

  constructor(private readonly layoutService: LayoutService) {}

  @HostListener('window:keydown', ['$event'])
  public processKeyPressEvent(event: KeyboardEvent): void {
    if (!this.closeByEsc || isNullOrUndefined(event) || isNullOrUndefined(event.key)) {
      return;
    }
    const isEscPressed: boolean = event.key.toLowerCase() === 'escape';
    if (!isEscPressed) {
      return;
    }
    this.closeDrawer();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.processIsVisibleValueChange(changes.isVisible);
    this.processwithOverlayValueChange(changes.withOverlay);
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const isCollapseAnimationDone: boolean = String(event.toState) === 'false';
    if (!isCollapseAnimationDone) {
      return;
    }
    this.shouldRenderContent = false;
    this.shouldHideContent = true;
  }

  private processIsVisibleValueChange(change: SimpleChange): void {
    if (isNullOrUndefined(change) || change.currentValue === change.previousValue) {
      return;
    }
    const drawerBecameVisible: boolean = change.currentValue === true;
    drawerBecameVisible ? this.openDrawer() : this.closeDrawer();
  }

  private processwithOverlayValueChange(change: SimpleChange): void {
    if (isNullOrUndefined(change) || !this.isVisible) {
      return;
    }
    const overlayIsVisible: boolean = change.currentValue === true;
    overlayIsVisible ? this.showOverlay() : this.hideOverlay();
  }

  private openDrawer(): void {
    this.shouldRenderContent = true;
    this.shouldHideContent = false;
    if (this.withOverlay) {
      this.showOverlay();
    }
  }

  private closeDrawer(): void {
    this.hideOverlay();
    this.close.emit();
  }

  private showOverlay(): void {
    this.layoutService.setOverlayMode('enabled').setScrollingMode('disabled');
  }

  private hideOverlay(): void {
    this.layoutService.setOverlayMode('disabled').setScrollingMode('enabled');
  }
}
