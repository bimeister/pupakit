import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, Inject } from '@angular/core';
import { Position } from '@bimeister/pupakit.common';
import { VOID } from '@bimeister/utilities';
import { asapScheduler, BehaviorSubject, fromEvent, merge, Observable, of, scheduled } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DropdownRef } from '../dropdown-ref.class';

@Directive()
export abstract class DropdownComponentBase<TData> implements AfterViewInit {
  public readonly data: TData = this.dropdownRef.config.data;

  private readonly animationStateSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly animationState$: Observable<boolean> = this.animationStateSubject$.asObservable();

  public static readonly animations: AnimationTriggerMetadata[] = [
    trigger('show', [
      state('false', style({ transform: 'translateY(10px)', opacity: 0 })),
      state('true', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('false => true', [animate(`150ms ease-in`)]),
      transition('true => false', [animate(`150ms ease-out`)]),
    ]),
  ];

  constructor(
    protected readonly dropdownRef: DropdownRef<TData>,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
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
    const mouseDown$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousedown').pipe(
      filter(
        (event: MouseEvent) =>
          !(
            DropdownComponentBase.eventTargetIsHtmlElement(event.target) &&
            DropdownComponentBase.dropdownTargetIsHtmlElement(this.dropdownRef.config.target) &&
            this.dropdownRef.config.target.contains(event.target)
          )
      )
    );
    const touchMove$: Observable<TouchEvent> = fromEvent<TouchEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<UIEvent> = fromEvent<UIEvent>(window, 'resize');

    merge(mouseDown$, touchMove$, wheel$, resize$)
      .pipe(take(1))
      .subscribe(() => this.dropdownRef.close());
  }

  private static eventTargetIsHtmlElement(target: EventTarget): target is HTMLElement {
    return target instanceof HTMLElement;
  }

  private static dropdownTargetIsHtmlElement(target: HTMLElement | Position): target is HTMLElement {
    return target instanceof HTMLElement;
  }
}
