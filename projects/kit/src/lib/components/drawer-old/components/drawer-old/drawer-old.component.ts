import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DrawerFloat } from '../../../../../internal/declarations/types/drawer-float.type';
import { DrawerDraggerOldComponent } from '../drawer-dragger-old/drawer-dragger-old.component';

@Component({
  selector: 'pupa-drawer-old',
  templateUrl: './drawer-old.component.html',
  styleUrls: ['./drawer-old.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerExpanded', [
      state('false', style({ width: 0 })),
      state('true', style({ width: `*` })),
      transition('false => true', animate('0.32s cubic-bezier(0.97, 0.84, .03, 0.95)')),
      transition('true => false', animate('0.2s ease-in-out')),
    ]),
  ],
})
/** @deprecated legacy */
export class DrawerOldComponent implements OnChanges, AfterContentInit, OnDestroy {
  private draggerMoveSubscription: Subscription = new Subscription();

  public readonly modifiedContentWidthPx$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  private shouldShowOverlay: boolean = false;
  private shouldRenderContent: boolean = false;
  private shouldHideContent: boolean = true;

  @ContentChild(DrawerDraggerOldComponent, { static: false })
  private readonly draggerComponent: DrawerDraggerOldComponent;
  @ViewChild('drawerContentElement', { static: false }) private readonly drawerContentRef: ElementRef<HTMLDivElement>;

  /**
   * @description content wrapper CSS styles property
   * @example contentWidth = '300px'
   */
  @Input() public contentWidth: string = 'fit-content';
  @Input() public maxContentWidth: string = '80vw';
  @Input() public minContentWidth: string = '0';
  @Input() public float: DrawerFloat = 'right';
  @Input() public withPadding: boolean = true;
  @Input() public isVisible: boolean = false;
  @Input() public destroyContentOnClose: boolean = true;
  @Input() public withOverlay: boolean = false;
  @Input() public closeByEsc: boolean = true;
  @Input() public closeByOverlayClick: boolean = true;

  @Output() public readonly close: EventEmitter<void> = new EventEmitter<void>();

  public get isContentRendered(): boolean {
    return this.destroyContentOnClose ? this.shouldRenderContent : true;
  }

  public get isContentVisible(): boolean {
    return !this.shouldHideContent;
  }

  public get isOverlayVisible(): boolean {
    return this.withOverlay ? this.shouldShowOverlay : false;
  }

  @HostListener('window:keydown', ['$event'])
  public processKeyPressEvent(event: KeyboardEvent): void {
    if (!this.closeByEsc || isNil(event) || isNil(event.key)) {
      return;
    }
    const isEscPressed: boolean = event.key.toLowerCase() === 'escape';
    if (!isEscPressed) {
      return;
    }
    this.closeDrawer();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsVisibleValueChange(changes.isVisible);
    this.processwithOverlayValueChange(changes.withOverlay);
  }

  public ngAfterContentInit(): void {
    this.draggerMoveSubscription.unsubscribe();
    this.draggerMoveSubscription = this.subscribeOnDraggerMoveIfDraggerIsDefined();
  }

  public ngOnDestroy(): void {
    if (this.draggerMoveSubscription.closed) {
      return;
    }
    this.draggerMoveSubscription.unsubscribe();
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const isCollapseAnimationDone: boolean = String(event.toState) === 'false';
    if (!isCollapseAnimationDone) {
      return;
    }
    this.shouldRenderContent = false;
    this.shouldHideContent = true;
  }

  public getContentAreaWidth(modifiedWidthPx: number): string {
    if (isNil(modifiedWidthPx)) {
      return this.contentWidth;
    }
    return `${modifiedWidthPx}px`;
  }

  public processOverlayClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.closeByOverlayClick) {
      return;
    }
    this.closeDrawer();
  }

  private processIsVisibleValueChange(change: ComponentChange<this, boolean>): void {
    if (isNil(change) || change.currentValue === change.previousValue) {
      return;
    }
    const drawerBecameVisible: boolean = change.currentValue;
    drawerBecameVisible ? this.openDrawer() : this.closeDrawer();
  }

  private processwithOverlayValueChange(change: ComponentChange<this, boolean>): void {
    if (isNil(change) || !this.isVisible) {
      return;
    }
    const overlayIsVisible: boolean = change.currentValue;
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
    this.shouldShowOverlay = true;
  }

  private hideOverlay(): void {
    this.shouldShowOverlay = false;
  }

  private subscribeOnDraggerMoveIfDraggerIsDefined(): Subscription {
    if (isNil(this.draggerComponent)) {
      return new Subscription();
    }

    return this.draggerComponent.mouseOffsetFromElementPx$
      .pipe(
        takeUntil(this.draggerComponent.destroy$),
        filter(() => !isNil(this.drawerContentRef) && !isNil(this.drawerContentRef.nativeElement))
      )
      .subscribe((horizontalMouseOffsetFromElementPx: number) => {
        const currentWidthPx: number = this.drawerContentRef.nativeElement.getBoundingClientRect().width;
        const modifiedWidthPx: number =
          this.float === 'right'
            ? currentWidthPx - horizontalMouseOffsetFromElementPx
            : currentWidthPx + horizontalMouseOffsetFromElementPx;
        this.modifiedContentWidthPx$.next(modifiedWidthPx);
      });
  }
}
