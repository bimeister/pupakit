import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClientUiStateHandlerService, subscribeOutsideAngular } from '@bimeister/pupakit.common';
import { ScrollableComponent } from '@bimeister/pupakit.kit';
import { filterFalsy, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { TextareaBase } from '../../../../declarations/classes/abstract/textarea-base.abstract';
import { DOCUMENT } from '@angular/common';

const CLOSE_ANIMATION_MS: number = 100;
const DELTA_SCROLL_FOR_CLOSE_PX: number = 50;

@Component({
  selector: 'pupa-textarea-inline',
  templateUrl: './textarea-inline.component.html',
  styleUrls: ['./textarea-inline.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaInlineComponent extends TextareaBase implements OnInit {
  @ViewChild('trigger', { static: true })
  private readonly triggerRef: ElementRef<HTMLElement>;

  @ViewChild('overlayTextarea', { static: true })
  private readonly overlayTextareaRef: TemplateRef<unknown>;

  @ViewChild('scrollable')
  public readonly scrollableRef: ScrollableComponent;

  public readonly isOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly overlayPositions: ConnectionPositionPair[] = [
    new ConnectionPositionPair({ originX: 'end', originY: 'center' }, { overlayX: 'end', overlayY: 'center' }),
  ];

  public readonly isValueEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => isEmpty(value.trim())));

  public readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  private currentOverlayRef: Nullable<OverlayRef> = null;
  private lastDeltaScrollY: number = 0;

  constructor(
    @Optional() ngControl: NgControl,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly overlay: Overlay,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly ngZone: NgZone
  ) {
    super(ngControl);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.subscription.add(this.handleMouseDown());
    this.subscription.add(this.handleDocumentWheel());
  }

  public open(): void {
    this.isDisabled$
      .pipe(
        take(1),
        filterFalsy(),
        switchMap(() => this.isMobile$),
        take(1),
        tap((isMobile: boolean) => {
          if (isMobile) {
            this.openForMobile();
            return;
          }

          this.openForDesktop();
        })
      )
      .subscribe(() => {
        setTimeout(() => {
          this.setTextareaSelectionAndScroll();
          this.isOpened$.next(true);
        });
      });
  }

  public close(): void {
    this.isOpened$.next(false);

    setTimeout(() => {
      this.currentOverlayRef?.dispose();
      this.currentOverlayRef = null;
    }, CLOSE_ANIMATION_MS);
  }

  public emitBlurEvent(blurEvent: FocusEvent): void {
    super.emitBlurEvent(blurEvent);
    this.close();
  }

  public recalculatePosition(event: WheelEvent): void {
    if (isNil(this.currentOverlayRef)) {
      return;
    }

    this.lastDeltaScrollY += event.deltaY;

    if (Math.abs(this.lastDeltaScrollY) > DELTA_SCROLL_FOR_CLOSE_PX) {
      this.lastDeltaScrollY = 0;
      this.close();
      return;
    }

    this.currentOverlayRef?.updatePosition();
  }

  private openForDesktop(): void {
    const trigger: HTMLElement = this.triggerRef.nativeElement;
    const portal: TemplatePortal = new TemplatePortal(this.overlayTextareaRef, this.viewContainerRef);

    this.currentOverlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().flexibleConnectedTo(trigger).withPositions(this.overlayPositions),
      width: trigger.clientWidth,
    });
    this.currentOverlayRef.attach(portal);
  }

  private openForMobile(): void {
    const portal: TemplatePortal = new TemplatePortal(this.overlayTextareaRef, this.viewContainerRef);

    this.currentOverlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      width: '100%',
      hasBackdrop: true,
    });
    this.currentOverlayRef.attach(portal);
  }

  private setTextareaSelectionAndScroll(): void {
    const textarea: HTMLTextAreaElement = this.textareaElementRef.nativeElement;

    this.value$.pipe(take(1)).subscribe((value: string) => {
      textarea.selectionStart = value.length;
      this.scrollableRef.scrollToBottom();
    });
  }

  private handleMouseDown(): Subscription {
    return fromEvent(this.document, 'mousedown')
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.close());
  }

  private handleDocumentWheel(): Subscription {
    return fromEvent(this.document, 'wheel')
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((event: WheelEvent) => this.recalculatePosition(event));
  }
}
