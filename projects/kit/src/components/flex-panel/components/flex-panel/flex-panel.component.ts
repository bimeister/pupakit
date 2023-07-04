import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { ComponentChanges, subscribeOutsideAngular } from '@bimeister/pupakit.common';
import { debounceTime, filter, map } from 'rxjs/operators';
import { filterNotNil, isNil } from '@bimeister/utilities';

function isTriggeredByResizer(event: Event): boolean {
  const targetPath: EventTarget[] = event.composedPath();
  return targetPath.some((target: EventTarget) => target instanceof HTMLElement && 'resizer' in target.dataset);
}

const DEFAULT_PERCENT_FOR_THRESHOLD: number = 10;
const MAX_PERCENT_OF_VIEWPORT: number = 50;

@Component({
  selector: 'pupa-flex-panel',
  templateUrl: './flex-panel.component.html',
  styleUrls: ['./flex-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexPanelComponent implements OnInit, OnChanges, OnDestroy {
  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);
  private screenWidth: number;
  private maxWidth: number;
  private readonly subscription: Subscription = new Subscription();

  @Input() public defaultSize: number = 350;
  private lastSize: number = this.defaultSize;
  private lastDeltaPx: number = 0;

  @Input() public resizable: boolean = true;
  @Input() public thresholdVw: number = DEFAULT_PERCENT_FOR_THRESHOLD;
  @Output() public thresholdReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() public sizeChanged: EventEmitter<number> = new EventEmitter<number>();

  public readonly widthPx$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(this.defaultSize);

  constructor(private readonly elementRef: ElementRef, private readonly ngZone: NgZone) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('defaultSize')) {
      this.resetSizeToDefault();
    }
  }

  public ngOnInit(): void {
    this.resetSizeToDefault();
    this.onResize();
    this.initHammerEvents();
    this.subscription.add(this.handleSizeChange());
    this.subscription.add(this.handleTriggerResizeEvent());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.hammerManager.destroy();
  }

  public processDoubleTap(): void {
    this.resetSizeToDefault();
  }

  public processPan(event: HammerInput): void {
    if (isTriggeredByResizer(event.srcEvent)) {
      this.processChangeSize(event.deltaX);
    }
  }

  public processPanEnd(): void {
    this.lastSize = this.lastSize + this.lastDeltaPx;
  }

  private handleTriggerResizeEvent(): Subscription {
    return fromEvent<UIEvent>(window, 'resize')
      .pipe(subscribeOutsideAngular(this.ngZone), debounceTime(100))
      .subscribe(() => this.onResize());
  }

  private onResize(): void {
    this.screenWidth = window.innerWidth;
    this.maxWidth = (window.innerWidth / 100) * MAX_PERCENT_OF_VIEWPORT;

    if (this.lastSize > this.maxWidth) {
      this.setMaxAvailableSize();
      this.widthPx$.next(this.maxWidth);
    }
  }

  private handleSizeChange(): Subscription {
    return this.widthPx$
      .pipe(
        filterNotNil(),
        filter((size: number) => size !== this.defaultSize),
        debounceTime(300),
        map((sizePx: number) => Math.round(sizePx))
      )
      .subscribe((sizePx: number) => this.sizeChanged.emit(sizePx));
  }

  private initHammerEvents(): void {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
    this.hammerManager.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

    this.hammerManager.on('pan', (event: HammerInput) => this.processPan(event));
    this.hammerManager.on('panend', () => this.processPanEnd());
    this.hammerManager.on('doubletap', () => this.processDoubleTap());
  }

  private processChangeSize(deltaX: number): void {
    const calculatedSize: number = this.lastSize + deltaX;

    if (calculatedSize < 0 || calculatedSize > this.maxWidth) {
      this.setMaxAvailableSize();
      return;
    }

    if (calculatedSize <= (this.screenWidth / 100) * this.thresholdVw) {
      this.thresholdReached.emit();
    }

    this.widthPx$.next(calculatedSize);
    this.lastDeltaPx = deltaX;
  }

  private resetSizeToDefault(): void {
    if (isNil(this.defaultSize)) {
      return;
    }

    this.widthPx$.next(this.defaultSize);
    this.lastSize = this.defaultSize;
    this.sizeChanged.emit(this.lastSize);
  }

  private setMaxAvailableSize(): void {
    this.lastSize = this.maxWidth;
  }
}
