import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output, Renderer2,
} from '@angular/core';
import { PupaResizeableDirective } from './resizeable.directive';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { isNil } from '@bimeister/utilities';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ResizerType } from '../../../declarations/types/resizer.type';
import { ResizerOffsetDirection } from '../../../declarations/types/resizer-offset-direction.type';

@Directive({
  selector: '[pupaResizer]'
})
export class PupaResizerDirective implements OnInit, OnDestroy {
  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);

  @Input() public pupaResizer: ResizerType = 'width';
  @Input() public pupaResizerMaxSize: number = 400;
  @Input() public pupaResizerMinSize: number = 100;
  @Input() public defaultSize: number = 300;

  private readonly subscriptions: Subscription = new Subscription();

  private readonly resizerOffsetChange: BehaviorSubject<number> = new BehaviorSubject<number>(this.defaultSize);
  private readonly resizerOffsetChange$: Observable<number> = this.resizerOffsetChange.pipe(map((sizePx: number) => this.sizeProtector(sizePx)));

  private lastSize: number = this.defaultSize;
  private lastDeltaPx: number = 0;

  @Output() public minSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public maxSizeReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public sizeChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(@Inject(PupaResizeableDirective) private readonly resizable: ElementRef<HTMLElement>,
              private readonly elementRef: ElementRef,
              private readonly renderer: Renderer2) {}

  public ngOnInit(): void {
    this.initHammerEvents();
    this.initResizer();
  }

  public ngOnDestroy(): void {
    this.hammerManager.destroy();
  }

  public processDoubleTap(): void {
    this.resetSizeToDefault();
  }

  public processPan(event: HammerInput): void {
    console.log(event.deltaY, this.lastDeltaPx)
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

  private sizeProtector(size: number): number {
    if (size > this.pupaResizerMaxSize) {
      return this.pupaResizerMaxSize;
    }
    if (size < this.pupaResizerMinSize) {
      return this.pupaResizerMinSize;
    }

    return size;
  }

  private initResizer(): void {
    this.subscriptions.add(this.handleChangeOffset());
    this.subscriptions.add(this.handleReachingOfMinAndMax());
    this.subscriptions.add(this.handleChangeSize());

    this.resizerOffsetChange.next(this.defaultSize);
  }

  private handleReachingOfMinAndMax(): Subscription {
    return this.resizerOffsetChange$.pipe(
      debounceTime(300)
    ).subscribe((size: number) => {
      if (size === this.pupaResizerMaxSize) {
        this.maxSizeReached.emit();
      }
      if (size === this.pupaResizerMinSize) {
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
    if (isNil(this.defaultSize)) {
      return;
    }

    this.lastSize = this.defaultSize;
    this.lastDeltaPx = 0;
    this.resizerOffsetChange.next(this.defaultSize);
  }
}
