import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit, Optional,
  Output,
  Renderer2,
} from '@angular/core';
import { PupaResizeableDirective } from './resizeable.directive';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { isNil } from '@bimeister/utilities';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ResizerType } from '../../../declarations/types/resizer.type';
import { ResizerOffsetDirection } from '../../../declarations/types/resizer-offset-direction.type';
import { ComponentChanges, subscribeOutsideAngular } from '@bimeister/pupakit.common';

@Directive({
  selector: '[pupaResizer]'
})
export class PupaResizerDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public pupaResizer: ResizerType = 'width';
  @Input() public pupaResizerMaxSize: string | number = '400px';
  @Input() public pupaResizerMinSize: string | number = '100px';
  @Input() public pupaResizerDefaultSize: string | number;

  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);
  private readonly subscriptions: Subscription = new Subscription();
  private screenWidth: number;
  private screenHeight: number;

  private readonly resizerOffsetChange: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private readonly resizerOffsetChange$: Observable<number> = this.resizerOffsetChange.pipe(map((sizePx: number) => this.sizeProtector(sizePx)));

  private lastSize: number = 0;
  private lastDeltaPx: number = 0;
  private pupaResizerMaxSizePx: number;
  private pupaResizerMinSizePx: number;
  private pupaResizerDefaultSizePx: number;

  @Output() public minSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public maxSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public sizeChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(@Inject(PupaResizeableDirective) @Optional() private readonly resizable: ElementRef<HTMLElement>,
              private readonly elementRef: ElementRef,
              private readonly ngZone: NgZone,
              private readonly renderer: Renderer2) {
    if (isNil(this.resizable)) {
      throw new Error(`Resizable directive not found`);
    }
  }

  public ngOnInit(): void {
    this.initHammerEvents();
    this.initResizer();
    this.initScreenWidth();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('pupaResizerDefaultSize')) {
      this.initScreenWidth();
      this.lastSize = this.pupaResizerDefaultSizePx;
      this.setSize(this.pupaResizerDefaultSizePx);
    }
    if (changes.hasOwnProperty('pupaResizerMaxSize') ||changes.hasOwnProperty('pupaResizerMinSize')) {
      this.initScreenWidth();
      this.lastSize = this.pupaResizerDefaultSizePx;
      this.setSize(this.pupaResizerDefaultSizePx);
    }
  }

  public ngOnDestroy(): void {
    this.hammerManager.destroy();
  }

  public processDoubleTap(): void {
    this.resetSizeToDefault();
  }

  public processPan(event: HammerInput): void {
    if (this.pupaResizer === 'width') {
      this.lastDeltaPx = event.deltaX;
    } else {
      this.lastDeltaPx = event.deltaY;
    }

    this.resizerOffsetChange.next(this.lastSize + this.lastDeltaPx);
  }

  public processPanEnd(): void {
    this.lastSize = this.lastSize + this.lastDeltaPx;
    this.resizerOffsetChange.next(this.lastSize);
  }

  private handleTriggerResizeEvent(): Subscription {
    return fromEvent<UIEvent>(window, 'resize')
      .pipe(subscribeOutsideAngular(this.ngZone), debounceTime(100))
      .subscribe(() => this.initScreenWidth());
  }

  private sizeProtector(size: number): number {
    if (isNil(size)) {
      return this.pupaResizerDefaultSizePx
    }

    if (size > this.pupaResizerMaxSizePx) {
      this.lastSize = this.pupaResizerMaxSizePx;
      return this.pupaResizerMaxSizePx;
    }

    if (size < this.pupaResizerMinSizePx) {
      this.lastSize = this.pupaResizerMinSizePx;
      return this.pupaResizerMinSizePx;
    }

    return size;
  }

  private initResizer(): void {
    this.subscriptions.add(this.handleChangeOffset());
    this.subscriptions.add(this.handleReachingOfMinAndMax());
    this.subscriptions.add(this.handleChangeSize());
    this.subscriptions.add(this.handleTriggerResizeEvent());

    this.resizerOffsetChange.next(this.pupaResizerDefaultSizePx);
  }

  private handleReachingOfMinAndMax(): Subscription {
    return this.resizerOffsetChange$.pipe(
      debounceTime(300)
    ).subscribe((size: number) => {
      if (size === this.pupaResizerMaxSizePx) {
        this.maxSizeReached.emit();
      }
      if (size === this.pupaResizerMinSizePx) {
        this.minSizeReached.emit();
      }
    });
  }

  private handleChangeSize(): Subscription {
    return this.resizerOffsetChange$.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    )
      .subscribe((size: number) => {
        this.sizeChanged.emit(size);
      })
  }

  private handleChangeOffset(): Subscription {
    return this.resizerOffsetChange$
      .subscribe((size: number) => this.setSize(size));
  }

  private initHammerEvents(): void {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
    this.hammerManager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

    this.hammerManager.on('pan', (event: HammerInput) => this.processPan(event));
    this.hammerManager.on('panend', () => this.processPanEnd());
    this.hammerManager.on('doubletap', () => this.processDoubleTap());
  }

  private setSize(size: number): void {
    const resizerDirection: ResizerOffsetDirection = this.pupaResizer === 'width' ? 'left' : 'top';
    const resizableDirection: ResizerType = this.pupaResizer === 'width' ? 'width' : 'height';

    this.renderer.setStyle(this.resizable.nativeElement, resizableDirection, size + 'px');
    this.renderer.setStyle(this.elementRef.nativeElement, resizerDirection, size + 'px');
  }

  private resetSizeToDefault(): void {
    if (isNil(this.pupaResizerDefaultSize)) {
      return;
    }

    this.lastSize = this.pupaResizerDefaultSizePx;
    this.lastDeltaPx = 0;
    this.resizerOffsetChange.next(this.pupaResizerDefaultSizePx);
  }

  private initScreenWidth(): void {
    if (this.pupaResizer === 'width') {
      this.setPercentWidthMultiply();
     return;
    }

    this.setPercentHeightMultiply();
  }

  private setPercentWidthMultiply(): void {
    this.screenWidth = window.innerWidth;
    const division = this.screenWidth / 100;

    this.convertInputFormat(division);
  }

  private setPercentHeightMultiply(): void {
    this.screenHeight = window.innerHeight;
    const division = this.screenHeight / 100;

    this.convertInputFormat(division);
  }

  private convertInputFormat(division: number): void {
    this.pupaResizerMaxSizePx = this.convertToNumberWithMultiplier(this.pupaResizerMaxSize, division);
    this.pupaResizerMinSizePx = this.convertToNumberWithMultiplier(this.pupaResizerMinSize, division);
    this.pupaResizerDefaultSizePx = this.convertToNumberWithMultiplier(this.pupaResizerDefaultSize, division);
  }

  private convertToNumberWithMultiplier(value: string | number, multiplier: number): number {
    const safeValue = String(value);
    const parsedValue = Number.parseFloat(safeValue);

    if (safeValue.indexOf('%') !== -1) {
      return parsedValue * multiplier;
    }

    return parsedValue;
  }
}
