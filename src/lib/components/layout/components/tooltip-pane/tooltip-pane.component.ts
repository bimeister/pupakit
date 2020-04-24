import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  TooltipConfig,
  TooltipBubbleDirection
} from '../../../../../internal/declarations/interfaces/tooltip-config.interface';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { TooltipService } from '../../services/tooltip.service';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

const HALF_DIVIDER: number = 2;
const MINIMAL_TIME_SHOWING_MS: number = 100;
const OFFSET_FROM_TRIGGER_PX: number = 11;

@Component({
  selector: 'pupa-tooltip-pane',
  templateUrl: './tooltip-pane.component.html',
  styleUrls: ['./tooltip-pane.component.scss'],
  animations: [
    trigger('enterLeaveAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('150ms', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipPaneComponent implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly isOpened$: Observable<boolean> = this.tooltipService.isOpened$;
  public readonly tooltipContent$: Observable<TooltipConfig> = this.tooltipService.tooltipContent$;
  private readonly eventUnlisteners: Set<EventUnlistener> = new Set<EventUnlistener>();

  public bubbleDirection: TooltipBubbleDirection = 'bottom';

  @ViewChild('root', { static: false }) public contentRef: ElementRef<HTMLElement>;
  @ViewChild('clickEventContainer', { static: false }) public clickEventContainerRef: ElementRef<HTMLElement>;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly tooltipService: TooltipService,
    private readonly renderer: Renderer2
  ) {
    this.subscription.add(this.handleIsOpenedChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:mousedown')
  @HostListener('window:wheel')
  public closeOnOuterEvents(): void {
    this.tooltipService.close();
  }

  private handleIsOpenedChanges(): Subscription {
    return this.isOpened$.subscribe((isOpened: boolean) => {
      if (isOpened) {
        this.listenEventsAndSetPosition();
        return;
      }
      this.unlistenEvents();
    });
  }

  private listenEventsAndSetPosition(): void {
    this.tooltipContent$.pipe(take(1)).subscribe((tooltipContent: TooltipConfig) => {
      requestAnimationFrame(() => {
        if (isNullOrUndefined(this.contentRef) || isNullOrUndefined(this.clickEventContainerRef)) {
          return;
        }

        this.eventUnlisteners
          .add(this.listenContentMouseMove())
          .add(this.listenTriggerMouseMove(tooltipContent.triggerRef))
          .add(this.listenTriggerMouseDown(tooltipContent.triggerRef))
          .add(this.listenContentMouseDown())
          .add(this.listenContentWheel())
          .add(this.listenClickEventContainerClick(tooltipContent.closeOnContentClick));

        this.listenWindowMouseMoveToClose();

        const triggerClientRect: ClientRect = tooltipContent.triggerRef.nativeElement.getBoundingClientRect();
        const contentClientRect: ClientRect = this.contentRef.nativeElement.getBoundingClientRect();

        const halfContentWidth: number = contentClientRect.width / HALF_DIVIDER;
        const halfTriggerWidth: number = triggerClientRect.width / HALF_DIVIDER;
        const halfContentHeight: number = contentClientRect.height / HALF_DIVIDER;
        const halfTriggerHeight: number = triggerClientRect.height / HALF_DIVIDER;

        let contentOffsetLeft: number = triggerClientRect.left - halfContentWidth + halfTriggerWidth;

        let contentOffsetTop: number = triggerClientRect.top - contentClientRect.height - OFFSET_FROM_TRIGGER_PX;

        this.bubbleDirection = 'bottom';

        if (TooltipPaneComponent.rightScreenSideOverflow(triggerClientRect, contentClientRect, this.hostElement)) {
          this.bubbleDirection = 'right';
          contentOffsetLeft = triggerClientRect.left - contentClientRect.width - OFFSET_FROM_TRIGGER_PX;
          contentOffsetTop = triggerClientRect.top + halfTriggerHeight - halfContentHeight;
        }

        if (TooltipPaneComponent.leftScreenSideOverflow(triggerClientRect, contentClientRect)) {
          this.bubbleDirection = 'left';
          contentOffsetLeft = triggerClientRect.left + triggerClientRect.width + OFFSET_FROM_TRIGGER_PX;
          contentOffsetTop = triggerClientRect.top + halfTriggerHeight - halfContentHeight;
        }

        if (TooltipPaneComponent.topScreenSideOverflow(contentOffsetTop)) {
          this.bubbleDirection = 'top';
          contentOffsetTop = triggerClientRect.top + triggerClientRect.height + OFFSET_FROM_TRIGGER_PX;
        }

        this.renderer.setStyle(this.contentRef.nativeElement, 'left', `${contentOffsetLeft}px`);
        this.renderer.setStyle(this.contentRef.nativeElement, 'top', `${contentOffsetTop}px`);

        this.changeDetectorRef.detectChanges();
      });
    });
  }

  private listenWindowMouseMoveToClose(): void {
    timer(MINIMAL_TIME_SHOWING_MS)
      .pipe(take(1))
      .subscribe(_ => {
        this.eventUnlisteners.add(
          this.renderer.listen(window, 'mousemove', () => {
            this.tooltipService.close();
          })
        );
      });
  }

  private listenContentMouseDown(): EventUnlistener {
    return this.renderer.listen(this.contentRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenContentMouseMove(): EventUnlistener {
    return this.renderer.listen(this.contentRef.nativeElement, 'mousemove', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenTriggerMouseMove(triggerRef: ElementRef<HTMLElement>): EventUnlistener {
    return this.renderer.listen(triggerRef.nativeElement, 'mousemove', (event: MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
    });
  }

  private listenTriggerMouseDown(triggerRef: ElementRef<HTMLElement>): EventUnlistener {
    return this.renderer.listen(triggerRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenContentWheel(): EventUnlistener {
    return this.renderer.listen(this.contentRef.nativeElement, 'wheel', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  private listenClickEventContainerClick(closeOnContentClick: boolean): EventUnlistener {
    return this.renderer.listen(this.clickEventContainerRef.nativeElement, 'click', () => {
      if (closeOnContentClick) {
        this.tooltipService.close();
      }
    });
  }

  private unlistenEvents(): void {
    this.eventUnlisteners.forEach((unlistener: EventUnlistener) => unlistener());
    this.eventUnlisteners.clear();
  }

  private static rightScreenSideOverflow(
    triggerClientRect: ClientRect,
    contentClientRect: ClientRect,
    hostElement: ElementRef<HTMLElement>
  ): boolean {
    return (
      triggerClientRect.left + contentClientRect.width / HALF_DIVIDER >
      hostElement.nativeElement.parentElement.offsetWidth
    );
  }

  private static leftScreenSideOverflow(triggerClientRect: ClientRect, contentClientRect: ClientRect): boolean {
    return triggerClientRect.left - contentClientRect.width / HALF_DIVIDER < 0;
  }

  private static topScreenSideOverflow(contentOffsetTop: number): boolean {
    return contentOffsetTop < 0;
  }
}
