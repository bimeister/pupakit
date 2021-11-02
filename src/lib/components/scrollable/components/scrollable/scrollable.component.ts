import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  RendererStyleFlags2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, forkJoin, fromEvent, Observable, of, Subscription } from 'rxjs';
import { ScrollableContentDirective } from '../../directives/scrollable-content.directive';
import { isNil } from '@bimeister/utilities';
import { fromHammerEvent } from '../../../../../internal/functions/from-hammer-event.function';
import { subscribeOutsideAngular } from '../../../../../internal/functions/rxjs-operators/subscribe-outside-angular.operator';
import { Scrollbar } from '../../../../../internal/declarations/classes/scrollbar.class';
import { getAnimationFrameLoop } from '../../../../../internal/functions/get-animation-frame-loop.function';
import { filter, switchMap, tap, throttleTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { ScrollbarType } from '../../../../../internal/declarations/types/scrollbar-type.type';
import { ScrollbarSize } from '../../../../../internal/declarations/types/scrollbar-size.type';
import { ScrollbarPosition } from '../../../../../internal/declarations/types/scrollbar-position.type';

const ANIMATION_FRAME_TROTTLE_TIME_MS: number = 1000 / 15;

@Component({
  selector: 'pupa-scrollable',
  templateUrl: './scrollable.component.html',
  styleUrls: ['./scrollable.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollableComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public invisibleScrollbars: ScrollbarType[] = [];
  @Input() public size: ScrollbarSize = 'small';
  @Input() public position: ScrollbarPosition = 'internal';
  @Input() public syncWith: ScrollableComponent[] = [];

  @Output() public readonly scrollTopChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() public readonly scrollLeftChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output() public readonly verticalScrollVisibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public readonly horizontalScrollVisibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('content', { static: true }) public contentRef: ElementRef<HTMLElement>;
  @ContentChild(ScrollableContentDirective, { static: true, read: ElementRef })
  public directiveContentRef: ElementRef<HTMLElement>;

  @ViewChild('verticalScrollbar', { static: true }) public verticalScrollbarRef: ElementRef<HTMLElement>;
  @ViewChild('verticalScrollbarThumb', { static: true }) public verticalScrollbarThumbRef: ElementRef<HTMLElement>;

  @ViewChild('horizontalScrollbar', { static: true }) public horizontalScrollbarRef: ElementRef<HTMLElement>;
  @ViewChild('horizontalScrollbarThumb', { static: true }) public horizontalScrollbarThumbRef: ElementRef<HTMLElement>;

  private readonly verticalScrollbar: Scrollbar = new Scrollbar();
  private readonly horizontalScrollbar: Scrollbar = new Scrollbar();

  public readonly hasVerticalScrollbar$: Observable<boolean> = this.verticalScrollVisibilityChanged.asObservable();
  public readonly hasHorizontalScrollbar$: Observable<boolean> = this.horizontalScrollVisibilityChanged.asObservable();

  public readonly isVerticalThumbGrabbing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isHorizontalThumbGrabbing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private contentElement: HTMLElement;
  private ignoreNextContentScrollEvent: boolean = false;

  constructor(
    private readonly ngZone: NgZone,
    public readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnInit(): void {
    this.setContentElement();
    this.subscription.add(this.processContentScrollEvent());

    this.subscription.add(this.processVerticalScrollbarThumbSizeChanges());
    this.subscription.add(this.processHorizontalScrollbarThumbSizeChanges());
    this.subscription.add(this.processVerticalScrollbarThumbOffsetChanges());
    this.subscription.add(this.processHorizontalScrollbarThumbOffsetChanges());
    this.subscription.add(this.processVerticalScrollbarPan());
    this.subscription.add(this.processHorizontalScrollbarPan());
    this.subscription.add(this.updateSizesOnAnimationFrame());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setScrollTop(scrollTop: number): void {
    this.setContentScrollTop(scrollTop);
  }

  public setScrollLeft(scrollLeft: number): void {
    this.ignoreNextContentScrollEvent = true;
    this.setContentScrollLeft(scrollLeft);
  }

  public setScrollTopByDelta(deltaScrollTop: number): void {
    this.setContentScrollTopByDelta(deltaScrollTop);
  }

  public setScrollLeftByDelta(deltaScrollLeft: number): void {
    this.setContentScrollLeftByDelta(deltaScrollLeft);
  }

  private processContentScrollEvent(): Subscription {
    const contentElement: HTMLElement = this.contentElement;

    return fromEvent(contentElement, 'scroll')
      .pipe(
        subscribeOutsideAngular(this.ngZone),
        tap(() => {
          this.scrollTopChanged.emit(contentElement.scrollTop);
          this.scrollLeftChanged.emit(contentElement.scrollLeft);

          this.verticalScrollbar.setContentScrollOffset(contentElement.scrollTop);
          this.horizontalScrollbar.setContentScrollOffset(contentElement.scrollLeft);
        }),
        filter(() => !this.ignoreNextContentScrollEvent)
      )
      .subscribe(() => {
        for (const scrollable of this.syncWith) {
          scrollable.setScrollTop(contentElement.scrollTop);
          scrollable.setScrollLeft(contentElement.scrollLeft);
        }
      });
  }

  private processVerticalScrollbarPan(): Subscription {
    let lastDeltaY: number = 0;

    const contentElement: HTMLElement = this.contentElement;
    const verticalScrollbarThumb: HTMLElement = this.verticalScrollbarThumbRef.nativeElement;

    const hammer: HammerManager = new Hammer(verticalScrollbarThumb);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

    return fromHammerEvent(hammer, ['panstart', 'panup', 'pandown', 'panend'])
      .pipe(
        subscribeOutsideAngular(this.ngZone),
        switchMap((event: HammerInput) => {
          const currentDeltaY: number = event.deltaY - lastDeltaY;
          return forkJoin(
            of(event),
            this.verticalScrollbar.getContentScrollOffsetByScrollbarThumbDeltaOffset(currentDeltaY)
          );
        })
      )
      .subscribe(([event, deltaScrollTop]: [HammerInput, number]) => {
        if (event.type === 'panstart') {
          this.isVerticalThumbGrabbing$.next(true);
          this.setBodyGrabbingCursor();
        }

        const prevContentScrollTop: number = contentElement.scrollTop;
        this.setContentScrollTop(contentElement.scrollTop + deltaScrollTop);

        if (contentElement.scrollTop !== prevContentScrollTop) {
          lastDeltaY = event.deltaY;
        }

        if (event.type === 'panend') {
          this.isVerticalThumbGrabbing$.next(false);
          this.removeBodyGrabbingCursor();
          lastDeltaY = 0;
        }
      });
  }

  private processHorizontalScrollbarPan(): Subscription {
    let lastDeltaX: number = 0;

    const contentElement: HTMLElement = this.contentElement;
    const horizontalScrollbarThumb: HTMLElement = this.horizontalScrollbarThumbRef.nativeElement;

    const hammer: HammerManager = new Hammer(horizontalScrollbarThumb);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    return fromHammerEvent(hammer, ['panstart', 'panleft', 'panright', 'panend'])
      .pipe(
        subscribeOutsideAngular(this.ngZone),
        switchMap((event: HammerInput) => {
          const currentDeltaX: number = event.deltaX - lastDeltaX;
          return forkJoin(
            of(event),
            this.horizontalScrollbar.getContentScrollOffsetByScrollbarThumbDeltaOffset(currentDeltaX)
          );
        })
      )
      .subscribe(([event, deltaScrollLeftPx]: [HammerInput, number]) => {
        if (event.type === 'panstart') {
          this.isHorizontalThumbGrabbing$.next(true);
          this.setBodyGrabbingCursor();
        }

        const prevContentScrollLeft: number = contentElement.scrollLeft;
        this.setContentScrollLeft(contentElement.scrollLeft + deltaScrollLeftPx);

        if (contentElement.scrollLeft !== prevContentScrollLeft) {
          lastDeltaX = event.deltaX;
        }

        if (event.type === 'panend') {
          this.isHorizontalThumbGrabbing$.next(false);
          this.removeBodyGrabbingCursor();
          lastDeltaX = 0;
        }
      });
  }

  private processVerticalScrollbarThumbSizeChanges(): Subscription {
    const verticalScrollbarThumb: HTMLElement = this.verticalScrollbarThumbRef.nativeElement;

    return this.verticalScrollbar.thumbSizePx$
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((thumbSizePx: number) => {
        this.renderer.setStyle(verticalScrollbarThumb, 'height', `${thumbSizePx}px`);
      });
  }

  private processHorizontalScrollbarThumbSizeChanges(): Subscription {
    const horizontalScrollbarThumb: HTMLElement = this.horizontalScrollbarThumbRef.nativeElement;

    return this.horizontalScrollbar.thumbSizePx$
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((thumbSizePx: number) => {
        this.renderer.setStyle(horizontalScrollbarThumb, 'width', `${thumbSizePx}px`);
      });
  }

  private processVerticalScrollbarThumbOffsetChanges(): Subscription {
    const verticalScrollbarThumb: HTMLElement = this.verticalScrollbarThumbRef.nativeElement;

    return this.verticalScrollbar.thumbOffsetPx$
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((thumbOffsetPx: number) => {
        this.renderer.setStyle(verticalScrollbarThumb, 'top', `${thumbOffsetPx}px`);
      });
  }

  private processHorizontalScrollbarThumbOffsetChanges(): Subscription {
    const horizontalScrollbarThumb: HTMLElement = this.horizontalScrollbarThumbRef.nativeElement;

    return this.horizontalScrollbar.thumbOffsetPx$
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((thumbOffsetPx: number) => {
        this.renderer.setStyle(horizontalScrollbarThumb, 'left', `${thumbOffsetPx}px`);
      });
  }

  private updateSizesOnAnimationFrame(): Subscription {
    return getAnimationFrameLoop()
      .pipe(subscribeOutsideAngular(this.ngZone), throttleTime(ANIMATION_FRAME_TROTTLE_TIME_MS))
      .subscribe(() => {
        this.setScrollBarsSizes();
      });
  }

  private setContentElement(): void {
    this.contentElement = isNil(this.directiveContentRef)
      ? this.contentRef.nativeElement
      : this.directiveContentRef.nativeElement;
  }

  private setScrollBarsSizes(): void {
    const contentElement: HTMLElement = this.contentElement;
    const verticalScrollbar: HTMLElement = this.verticalScrollbarRef.nativeElement;
    const horizontalScrollbar: HTMLElement = this.horizontalScrollbarRef.nativeElement;

    const isVerticalScrollbarVisible: boolean =
      !this.invisibleScrollbars.includes('vertical') && contentElement.scrollHeight > contentElement.clientHeight;
    this.verticalScrollVisibilityChanged.emit(isVerticalScrollbarVisible);

    const isHorizontalScrollbarVisible: boolean =
      !this.invisibleScrollbars.includes('horizontal') && contentElement.scrollWidth > contentElement.clientWidth;
    this.horizontalScrollVisibilityChanged.emit(isHorizontalScrollbarVisible);

    requestAnimationFrame(() => {
      this.verticalScrollbar.setSizes({
        contentSizePx: contentElement.clientHeight,
        contentScrollSizePx: contentElement.scrollHeight,
        scrollbarSizePx: verticalScrollbar.clientHeight
      });

      this.horizontalScrollbar.setSizes({
        contentSizePx: contentElement.clientWidth,
        contentScrollSizePx: contentElement.scrollWidth,
        scrollbarSizePx: horizontalScrollbar.clientWidth
      });
    });
  }

  private setContentScrollTop(scrollTop: number): void {
    const contentElement: HTMLElement = this.contentElement;
    this.renderer.setProperty(contentElement, 'scrollTop', scrollTop);
  }

  private setContentScrollTopByDelta(scrollTopDelta: number): void {
    const contentElement: HTMLElement = this.contentElement;
    this.renderer.setProperty(contentElement, 'scrollTop', contentElement.scrollTop + scrollTopDelta);
  }

  private setContentScrollLeft(scrollLeft: number): void {
    const contentElement: HTMLElement = this.contentElement;
    this.renderer.setProperty(contentElement, 'scrollLeft', scrollLeft);
  }

  private setContentScrollLeftByDelta(scrollLeftDelta: number): void {
    const contentElement: HTMLElement = this.contentElement;
    this.renderer.setProperty(contentElement, 'scrollLeft', contentElement.scrollLeft + scrollLeftDelta);
  }

  private setBodyGrabbingCursor(): void {
    this.renderer.setStyle(this.document.body, 'cursor', 'grabbing', RendererStyleFlags2.Important);
  }

  private removeBodyGrabbingCursor(): void {
    this.renderer.setStyle(this.document.body, 'cursor', null);
  }
}
