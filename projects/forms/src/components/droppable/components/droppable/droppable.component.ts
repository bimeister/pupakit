import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewEncapsulation,
  ViewRef,
} from '@angular/core';
import { isNil, VOID } from '@bimeister/utilities';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DroppableHorizontalPosition } from '../../declarations/types/droppable-horizontal-position.type';
import { DroppableVerticalPosition } from '../../declarations/types/droppable-vertical-position.type';
import { DroppableWidth } from '../../declarations/types/droppable-width.type';

@Component({
  selector: 'pupa-droppable',
  styleUrls: ['./droppable.component.scss'],
  templateUrl: './droppable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DroppableComponent implements OnDestroy {
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

  constructor(private readonly overlay: Overlay) {}

  public beforeOpen: () => Observable<void> = () => of(VOID);
  public beforeClose: () => Observable<void> = () => of(VOID);

  public ngOnDestroy(): void {
    this.close();
  }

  @HostListener('click')
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

  @HostListener('document:wheel')
  @HostListener('document:mousedown')
  @HostListener('document:click')
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
}
