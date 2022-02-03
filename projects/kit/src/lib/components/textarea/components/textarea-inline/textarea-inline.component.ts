import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { TextareaBase } from '../../../../../internal/declarations/classes/abstract/textarea-base.abstract';
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Observable } from 'rxjs';
import { filterFalsy, isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { NgControl } from '@angular/forms';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';

const CLOSE_ANIMATION_MS: number = 100;
const DELTA_SCROLL_FOR_CLOSE_PX: number = 50;

@Component({
  selector: 'pupa-textarea-inline',
  templateUrl: './textarea-inline.component.html',
  styleUrls: ['./textarea-inline.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaInlineComponent extends TextareaBase {
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
    @Optional() themeWrapperService: ThemeWrapperService,
    private readonly overlay: Overlay,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    super(ngControl, themeWrapperService);
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

  @HostListener('document:mousedown')
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

  @HostListener('document:wheel', ['$event'])
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
}
