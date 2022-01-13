import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { asyncScheduler, BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { map, observeOn, switchMap, take } from 'rxjs/operators';

import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

const MAX_SECONDS: number = 999;
const SMALL_FONT_AFTER: number = 99;
const SVG_VIEWPORT_SIZE_PX: number = 24;
const TIMER_INDICATOR_WIDTH_PX: number = 2;

@Component({
  selector: 'pupa-timer-round',
  templateUrl: './timer-round.component.html',
  styleUrls: ['./timer-round.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerRoundComponent implements OnChanges {
  @ViewChild('timerPath', { static: true }) private readonly timerPathRef: ElementRef<SVGPathElement>;

  @Output() public readonly timeIsUp: EventEmitter<void> = new EventEmitter<void>();

  @Input() public seconds: number = 0;
  private sanitizedSecondsInput: number = 0;

  private readonly radiusPx: number = (SVG_VIEWPORT_SIZE_PX - TIMER_INDICATOR_WIDTH_PX / 2) / 2;
  private readonly strokeLength: number = 2 * Math.PI * this.radiusPx;

  private subscription: Subscription | null = null;

  private readonly seconds$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly displaySeconds$: Observable<number> = this.seconds$.pipe(
    map((seconds: number) => Math.min(seconds + 1, this.sanitizedSecondsInput))
  );
  public readonly isSmallLabel$: Observable<boolean> = this.displaySeconds$.pipe(
    map((seconds: number) => seconds > SMALL_FONT_AFTER)
  );

  public readonly isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public readonly renderer: Renderer2) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processMsChanges(changes.seconds);
  }

  public restart(): void {
    this.stopTimer();
    setTimeout(() => this.initTimer());
  }

  public stop(): void {
    this.stopTimer();
  }

  private processMsChanges(change: ComponentChange<this, number>): void {
    const seconds: number = change?.currentValue ?? 0;
    this.sanitizedSecondsInput = seconds > MAX_SECONDS ? MAX_SECONDS : seconds;
    this.initTimer();
  }

  private initTimer(): void {
    this.seconds$.next(this.sanitizedSecondsInput);
    this.setTimerPercentage(100);

    this.startTimer();
  }

  private startTimer(): void {
    this.stopTimer();

    this.isActive$.next(true);
    this.subscription = timer(0, 1000)
      .pipe(
        observeOn(asyncScheduler),
        switchMap(() => this.seconds$.pipe(take(1)))
      )
      .subscribe((seconds: number) => {
        const remainingSeconds: number = seconds - 1;
        this.seconds$.next(remainingSeconds);

        if (seconds === 0) {
          this.stopTimer();
          this.timeIsUp.emit();
          return;
        }

        this.setTimerPercentage((remainingSeconds / this.sanitizedSecondsInput) * 100);
      });
  }

  private stopTimer(): void {
    this.isActive$.next(false);
    this.seconds$.next(this.sanitizedSecondsInput);
    this.setTimerPercentage(100);

    if (isNil(this.subscription)) {
      return;
    }

    this.subscription.unsubscribe();
    this.subscription = null;
  }

  private setTimerPercentage(percentage: number): void {
    this.renderer.setAttribute(
      this.timerPathRef.nativeElement,
      'stroke-dasharray',
      `${(this.strokeLength * percentage) / 100} ${this.strokeLength}`
    );
  }
}
