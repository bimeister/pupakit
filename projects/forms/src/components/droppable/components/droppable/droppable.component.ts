import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewRef,
} from '@angular/core';
import { isNil, VOID } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DroppableHorizontalPosition } from '../../declarations/types/droppable-horizontal-position.type';
import { DroppableVerticalPosition } from '../../declarations/types/droppable-vertical-position.type';
import { DroppableWidth } from '../../declarations/types/droppable-width.type';
import { DOCUMENT } from '@angular/common';
import { subscribeOutsideAngular } from '@bimeister/pupakit.common';

@Component({
  selector: 'pupa-droppable',
  styleUrls: ['./droppable.component.scss'],
  templateUrl: './droppable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DroppableComponent implements OnInit, OnDestroy {
  @Input() public closeOnContentClick: boolean = false;
  @Input() public horizontalPosition: DroppableHorizontalPosition = 'start';
  @Input() public verticalPosition: DroppableVerticalPosition = 'bottom';
  @Input() public offsetYPx: number = 10;
  @Input() public viewportMarginPx: number = 15;
  @Input() public hasBackdrop: boolean = false;
  @Input() public widthType: DroppableWidth = 'fit-content';

  public triggerRef: ElementRef<HTMLElement>;
  public contentRef: CdkPortal;
  private overlayRef: OverlayRef;
  private viewRef: ViewRef;

  public isOpened: boolean = false;
  public readonly isNativeClick$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly overlay: Overlay,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleClickOnHost());
    this.subscription.add(this.handleDocumentWheelAndMouseDownAndClick());
  }

  public beforeOpen: () => Observable<void> = () => of(VOID);
  public beforeClose: () => Observable<void> = () => of(VOID);

  public ngOnDestroy(): void {
    this.close();
    this.subscription.unsubscribe();
  }

  public open(): void {
    if (isNil(this.triggerRef) || isNil(this.contentRef)) {
      return;
    }

    this.isNativeClick$.next(true);

    this.beforeOpen()
      .pipe(
        take(1),
        switchMap(() => {
          this.overlayRef = this.overlay.create(this.getOverlayConfig());
          this.viewRef = this.overlayRef.attach(this.contentRef);

          this.isOpened = true;
          this.viewRef.markForCheck();
          return this.overlayRef.backdropClick();
        })
      )
      .subscribe(() => this.close());
  }

  public mouseEventsHandler(): void {
    this.isNativeClick$.pipe(take(1)).subscribe((isNativeClick: boolean) => {
      if (isNativeClick) {
        this.isNativeClick$.next(false);
        return;
      }

      if (this.hasBackdrop) {
        return;
      }

      this.close();
    });
  }

  public close(): void {
    if (isNil(this.overlayRef) || isNil(this.viewRef)) {
      return;
    }

    this.beforeClose()
      .pipe(take(1))
      .subscribe(() => {
        this.isOpened = false;
        this.viewRef.markForCheck();
        this.overlayRef.dispose();
      });
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy: PositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerRef)
      .withPush(true)
      .withViewportMargin(this.viewportMarginPx)
      .withPositions([
        {
          originX: this.horizontalPosition,
          originY: this.verticalPosition,
          overlayX: 'start',
          overlayY: 'top',
          offsetY: this.offsetYPx,
        },
      ]);

    return new OverlayConfig({
      positionStrategy,
      hasBackdrop: this.hasBackdrop,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  private handleDocumentWheelAndMouseDownAndClick(): Subscription {
    return merge(
      fromEvent(this.document, 'wheel'),
      fromEvent(this.document, 'mousedown'),
      fromEvent(this.document, 'click')
    )
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.mouseEventsHandler());
  }

  private handleClickOnHost(): Subscription {
    return fromEvent(this.elementRef.nativeElement, 'click')
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.open());
  }
}
