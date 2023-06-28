import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { ComponentChanges, subscribeOutsideAngular } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { ResizerCurrentSize } from '../../../declarations/interfaces/resizer-current-size.interface';
import { ResizerType } from '../../../declarations/types/resizer.type';
import { PupaResizableDirective } from './resizable.directive';

const DEFAULT_SIZE_PX: number = 100;
const DEFAULT_MAX_SIZE_PX: number = 400;
const DEFAULT_MIN_SIZE_PX: number = 100;
const DEFAULT_PADDINGS_OFFSET_PX: number = 0;
const RESIZE_CHANGE_DEBOUNCE_TIME_MS: number = 300;
const RESIZE_WINDOW_DEBOUNCE_TIME_MS: number = 100;

@Directive({
  selector: '[pupaResizer]',
  exportAs: 'pupaResizer',
})
export class PupaResizerDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public resizerType: ResizerType = 'width';
  @Input() public resizerMinSize: string | number = DEFAULT_MIN_SIZE_PX;
  @Input() public resizerMaxSize: string | number = DEFAULT_MAX_SIZE_PX;
  @Input() public resizerDefaultSize: string | number = DEFAULT_SIZE_PX;
  @Input() public resizerInitialSize: string | number = DEFAULT_SIZE_PX;
  @Input() public resizerPaddingsOffsetPx: number = DEFAULT_PADDINGS_OFFSET_PX;

  @Output() public readonly minSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly maxSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly currentSize: EventEmitter<ResizerCurrentSize> = new EventEmitter<ResizerCurrentSize>();

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);

  private readonly resizerOffsetState$: Subject<number> = new Subject<number>();
  private readonly currentSizePxWithinMixAndMaxSize$: Observable<number> = this.resizerOffsetState$.pipe(
    map((sizePx: number) => this.sizeProtector(sizePx))
  );

  private lastSizePx: number = 0;
  private lastDeltaPx: number = 0;
  private maxSizePx: number;
  private minSizePx: number;
  private actualSizePx: number;
  private defaultSizePx: number;
  private readonly isTriggeredPan$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(PupaResizableDirective) @Optional() private readonly resizable: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly elementRef: ElementRef,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2
  ) {
    if (isNil(this.resizable)) {
      throw new Error(`[PupaResizerDirective] Resizable directive was not found`);
    }

    this.setResizableStyles();
  }

  public ngOnInit(): void {
    this.initHammerEvents();
    this.initResizer();
    this.initScreenDimensions();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (
      !isNil(changes?.resizerMaxSize) ||
      !isNil(changes?.resizerMinSize) ||
      !isNil(changes?.resizerDefaultSize) ||
      !isNil(changes?.resizerInitialSize) ||
      !isNil(changes?.resizerPaddingsOffsetPx)
    ) {
      this.recalculateResizer();
    }
  }

  public ngOnDestroy(): void {
    this.hammerManager.destroy();
    this.subscription.unsubscribe();
  }

  private processDoubleTap(): void {
    this.resetSizeToDefault();
  }

  private processPan(event: HammerInput): void {
    this.lastDeltaPx = this.resizerType === 'width' ? event.deltaX : event.deltaY;
    this.resizerOffsetState$.next(this.lastSizePx + this.lastDeltaPx);
  }

  private processPanStart(): void {
    this.isTriggeredPan$.next(true);
    this.setActiveResizeState();
  }

  private processPanEnd(): void {
    this.lastSizePx = this.sizeProtector(this.lastSizePx + this.lastDeltaPx);
    this.resizerOffsetState$.next(this.lastSizePx);
    this.isTriggeredPan$.next(false);
    this.setInactiveResizerState();
  }

  private setResizableStyles(): void {
    this.renderer.setStyle(this.resizable.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.resizable.nativeElement, 'min-height', '100%');
  }

  private recalculateResizer(): void {
    this.initScreenDimensions();
    this.lastSizePx = this.actualSizePx;
    this.setSizePx(this.actualSizePx);
  }

  private sizeProtector(size: number): number {
    if (isNil(size)) {
      return this.actualSizePx;
    }

    if (size > this.maxSizePx) {
      return this.maxSizePx;
    }

    if (size < this.minSizePx) {
      return this.minSizePx;
    }

    return size;
  }

  private initResizer(): void {
    this.subscription.add(this.handleChangeSize());
    this.subscription.add(this.handleReachingOfMinAndMax());
    this.subscription.add(this.handleTriggerResizeEvent());
    this.subscription.add(this.handleTriggerMouseoverEvent());
    this.subscription.add(this.handleTriggerMouseleaveEvent());

    this.resizerOffsetState$.next(this.actualSizePx);
  }

  private initHammerEvents(): void {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 1, velocity: 1 }));
    this.hammerManager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

    this.hammerManager.on('pan', (event: HammerInput) => this.processPan(event));
    this.hammerManager.on('panstart', () => this.processPanStart());
    this.hammerManager.on('panend', () => this.processPanEnd());
    this.hammerManager.on('doubletap', () => this.processDoubleTap());
  }

  private setSizePx(sizePx: number): void {
    const resizableDirection: ResizerType = this.resizerType === 'width' ? 'width' : 'height';

    this.renderer.setStyle(this.resizable.nativeElement, resizableDirection, `${sizePx}px`);
  }

  private initScreenDimensions(): void {
    if (this.resizerType === 'width') {
      this.setWidthSizes();
      return;
    }

    this.setHeightSizes();
  }

  private setWidthSizes(): void {
    const division: number = this.getScreenWidthDivision();

    this.setConvertedResizerSizes(division);
  }

  private setHeightSizes(): void {
    const division: number = this.getScreenHeightDivision();

    this.setConvertedResizerSizes(division);
  }

  private setConvertedResizerSizes(division: number): void {
    this.maxSizePx = this.convertToNumberWithMultiplier(this.resizerMaxSize, division) - this.resizerPaddingsOffsetPx;
    this.minSizePx = this.convertToNumberWithMultiplier(this.resizerMinSize, division) - this.resizerPaddingsOffsetPx;
    this.defaultSizePx =
      this.convertToNumberWithMultiplier(this.resizerDefaultSize, division) - this.resizerPaddingsOffsetPx;
    this.actualSizePx = this.convertToNumberWithMultiplier(this.resizerInitialSize, division);
  }

  private convertToNumberWithMultiplier(value: string | number, multiplier: number): number {
    const safeValue: string = String(value);
    const parsedValue: number = Number.parseFloat(safeValue);

    if (safeValue.includes('%')) {
      return parsedValue * multiplier;
    }

    return parsedValue;
  }

  private resetSizeToDefault(): void {
    if (isNil(this.resizerDefaultSize)) {
      return;
    }

    this.lastSizePx = this.defaultSizePx;
    this.lastDeltaPx = 0;
    this.resizerOffsetState$.next(this.defaultSizePx);
  }

  private setInactiveResizerState(): void {
    this.renderer.removeStyle(this.document.body, 'cursor');
    this.isActive$.next(false);
  }

  private setActiveResizeState(): void {
    const cursorProperty: string = this.resizerType === 'width' ? 'col-resize' : 'row-resize';
    this.renderer.setStyle(this.document.body, 'cursor', cursorProperty);
    this.isActive$.next(true);
  }

  private adaptPercentageSizeOnResize(): void {
    if (this.lastSizePx < this.minSizePx) {
      this.setSizePx(this.minSizePx);
    }

    if (this.lastSizePx > this.maxSizePx) {
      this.setSizePx(this.maxSizePx);
    }
  }

  private getScreenWidthDivision(): number {
    return window.innerWidth / 100;
  }
  private getScreenHeightDivision(): number {
    return window.innerHeight / 100;
  }

  private handleTriggerResizeEvent(): Subscription {
    return fromEvent<UIEvent>(window, 'resize')
      .pipe(subscribeOutsideAngular(this.ngZone), debounceTime(RESIZE_WINDOW_DEBOUNCE_TIME_MS))
      .subscribe(() => {
        this.initScreenDimensions();
        this.adaptPercentageSizeOnResize();
      });
  }

  private handleReachingOfMinAndMax(): Subscription {
    return this.resizerOffsetState$
      .pipe(
        debounceTime(RESIZE_CHANGE_DEBOUNCE_TIME_MS),
        filter((size: number) => !Number.isNaN(size))
      )
      .subscribe((size: number) => {
        if (size > this.maxSizePx) {
          this.maxSizeReached.emit();
        }
        if (size < this.minSizePx) {
          this.minSizeReached.emit();
        }
      });
  }

  private handleChangeSize(): Subscription {
    return this.currentSizePxWithinMixAndMaxSize$
      .pipe(
        tap((size: number) => this.setSizePx(size)),
        distinctUntilChanged(),
        debounceTime(RESIZE_CHANGE_DEBOUNCE_TIME_MS),
        filter((size: number) => !(Number.isNaN(size) || Number.isNaN(this.lastDeltaPx)))
      )
      .subscribe((size: number) => {
        const sizeInPercents: number =
          this.resizerType === 'width' ? (size / window.innerWidth) * 100 : (size / window.innerHeight) * 100;

        this.currentSize.emit({
          px: size,
          percent: `${sizeInPercents}%`,
        });
      });
  }

  private handleTriggerMouseoverEvent(): Subscription {
    return fromEvent<UIEvent>(this.elementRef.nativeElement, 'mouseover')
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.isActive$.next(true));
  }

  private handleTriggerMouseleaveEvent(): Subscription {
    return fromEvent<UIEvent>(this.elementRef.nativeElement, 'mouseleave')
      .pipe(
        subscribeOutsideAngular(this.ngZone),
        withLatestFrom(this.isTriggeredPan$),
        filter(([_, isTriggeredPan]: [UIEvent, boolean]) => !isTriggeredPan)
      )
      .subscribe(() => this.setInactiveResizerState());
  }
}
