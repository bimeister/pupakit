import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, Inject } from '@angular/core';
import { VOID } from '@bimeister/utilities';
import { asapScheduler, BehaviorSubject, fromEvent, merge, Observable, of, scheduled } from 'rxjs';
import { take } from 'rxjs/operators';
import { DropdownRef } from '../dropdown-ref.class';

@Directive()
export abstract class DropdownComponentBase<TData> implements AfterViewInit {
  public readonly data: TData = this.dropdownRef.config.data;

  private readonly animationStateSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly animationState$: Observable<boolean> = this.animationStateSubject$.asObservable();

  public static readonly animations: AnimationTriggerMetadata[] = [
    trigger('show', [
      state('false', style({ margin: '0', transform: 'translateY(10px)', opacity: 0 })),
      state('true', style({ margin: '8px 0', transform: 'translateY(0)', opacity: 1 })),
      transition('false => true', [animate(`150ms ease-in`)]),
      transition('true => false', [animate(`150ms ease-out`)]),
    ]),
  ];

  constructor(public readonly dropdownRef: DropdownRef<TData>, @Inject(DOCUMENT) private readonly document: Document) {
    this.listenOutsideEventsForClose();
  }

  public ngAfterViewInit(): void {
    scheduled(of(VOID), asapScheduler)
      .pipe(take(1))
      .subscribe(() => this.setAnimationState(true));

    this.dropdownRef.closed$.pipe(take(1)).subscribe(() => this.setAnimationState(false));
  }

  private setAnimationState(animationState: boolean): void {
    this.animationStateSubject$.next(animationState);
  }

  private listenOutsideEventsForClose(): void {
    const touchMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'resize');

    merge(touchMove$, wheel$, resize$)
      .pipe(take(1))
      .subscribe(() => this.dropdownRef.close());
  }
}
