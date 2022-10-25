import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Directive } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ToastAnimationState } from '../../enums/toast-animation-state.enum';
import { ToastRef } from '../toast-ref.class';

@Directive()
export abstract class ToastComponentBase<TData, TReturn> implements AfterViewInit {
  public openAnimationDurationMs: number = 500;
  public closeAnimationDurationMs: number = 200;

  private readonly animationStateSubject$: BehaviorSubject<ToastAnimationState> =
    new BehaviorSubject<ToastAnimationState>(ToastAnimationState.ClosedInitial);
  public readonly animationState$: Observable<ToastAnimationState> = this.animationStateSubject$.asObservable();

  public readonly data: TData = this.toastRef.config.data;

  public static readonly animations: AnimationTriggerMetadata[] = [
    trigger('show', [
      state(ToastAnimationState.ClosedInitial, style({ height: 0, opacity: 0 })),
      state(ToastAnimationState.Opened, style({ height: '*', opacity: 1 })),
      state(ToastAnimationState.Closed, style({ opacity: 0 })),
      transition(
        `${ToastAnimationState.ClosedInitial} => ${ToastAnimationState.Opened}`,
        animate('{{ openAnimationDurationMs }}ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')
      ),
      transition(
        `${ToastAnimationState.Opened} => ${ToastAnimationState.Closed}`,
        animate('{{ closeAnimationDurationMs }}ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')
      ),
    ]),
  ];

  constructor(protected readonly toastRef: ToastRef<TData, TReturn>) {
    this.toastRef.setCloseDelayMs(this.closeAnimationDurationMs);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.setAnimationState(ToastAnimationState.Opened));
    this.toastRef.closeTriggered$.subscribe(() => this.setAnimationState(ToastAnimationState.Closed));
  }

  private setAnimationState(animationState: ToastAnimationState): void {
    this.animationStateSubject$.next(animationState);
  }
}
