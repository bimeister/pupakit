import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Directive, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { AlertAnimationState } from '../../enums/alert-animation-state.enum';
import { AlertRef } from '../alert-ref.class';

const PAN_DELTA_PX_CLOSE_TRIGGER: number = 200;

@Directive()
export abstract class AlertComponentBase<TData, TReturn> implements AfterViewInit {
  public openAnimationDurationMs: number = 500;
  public closeAnimationDurationMs: number = 200;

  private readonly animationStateSubject$: BehaviorSubject<AlertAnimationState> =
    new BehaviorSubject<AlertAnimationState>(AlertAnimationState.ClosedInitial);
  public readonly animationState$: Observable<AlertAnimationState> = this.animationStateSubject$.asObservable();

  public readonly data: TData = this.alertRef.config.data;

  public readonly panTranslateXPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly panTranslateX$: Observable<string> = this.panTranslateXPx$.pipe(
    map((panTranslateXPx: number) => `translateX(${panTranslateXPx}px)`)
  );

  public static readonly animations: AnimationTriggerMetadata[] = [
    trigger('show', [
      state(AlertAnimationState.ClosedInitial, style({ height: 0, opacity: 0 })),
      state(AlertAnimationState.Opened, style({ height: '*', opacity: 1 })),
      state(AlertAnimationState.Closed, style({ height: 0, opacity: 0 })),
      transition(
        `${AlertAnimationState.ClosedInitial} => ${AlertAnimationState.Opened}`,
        animate('{{ openAnimationDurationMs }}ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')
      ),
      transition(
        `${AlertAnimationState.Opened} => ${AlertAnimationState.Closed}`,
        animate('{{ closeAnimationDurationMs }}ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')
      ),
    ]),
  ];

  constructor(protected readonly alertRef: AlertRef<TData, TReturn>) {
    this.alertRef.setCloseDelayMs(this.closeAnimationDurationMs);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.setAnimationState(AlertAnimationState.Opened));
    this.alertRef.closeTriggered$.subscribe(() => this.setAnimationState(AlertAnimationState.Closed));
  }

  @HostListener('pan', ['$event'])
  public processPanRight(event: HammerInput): void {
    if (event.deltaX < 0) {
      return;
    }

    this.panTranslateXPx$.next(event.deltaX);

    if (event.deltaX > PAN_DELTA_PX_CLOSE_TRIGGER) {
      this.alertRef.close();
    }
  }

  @HostListener('panend')
  public processPanEnd(): void {
    this.panTranslateXPx$
      .pipe(
        take(1),
        filter((panTranslateXPx: number) => panTranslateXPx <= PAN_DELTA_PX_CLOSE_TRIGGER)
      )
      .subscribe(() => {
        this.panTranslateXPx$.next(0);
      });
  }

  private setAnimationState(animationState: AlertAnimationState): void {
    this.animationStateSubject$.next(animationState);
  }
}
