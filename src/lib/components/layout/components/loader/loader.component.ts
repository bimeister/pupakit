import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ElementState } from '../../../../internal/declarations/enums/element-state.enum';

@Component({
  selector: 'pupa-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('lineAppeared', [
      state(
        ElementState.dissapeared,
        style({
          transform: 'scale(0)'
        })
      ),
      state(
        ElementState.appeared,
        style({
          transform: 'scale(1)'
        })
      ),
      transition('false => true', animate('0.4s ease-out')),
      transition('true => false', animate('0.5s cubic-bezier(0.5, 1, 1, 1.2)'))
    ]),
    trigger('rectangleAppeared', [
      state(
        ElementState.dissapeared,
        style({
          transform: 'scale(0)'
        })
      ),
      state(
        ElementState.appeared,
        style({
          transform: 'scale(1)'
        })
      ),
      transition('false => true', animate('0.5s cubic-bezier(0.2, 1, 1, 1)')),
      transition('true => false', animate('0.25s cubic-bezier(0.5, 1, 0.8, 1)'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements AfterViewInit {
  public isLeftLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.dissapeared);
  public isCenterLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.dissapeared);
  public isRightLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.dissapeared);
  public isTopRectangleVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.dissapeared);
  public isBottomRectangleVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.dissapeared);

  public ngAfterViewInit(): void {
    this.startAnimation();
  }

  public switchLineState(
    animationEvent: AnimationEvent,
    animationStateRef: BehaviorSubject<string>,
    delay: number = 0
  ): void {
    if (animationEvent.fromState === ElementState.initial || animationEvent.toState === ElementState.dissapeared) {
      return;
    }
    setTimeout(() => {
      animationStateRef.next(ElementState.appeared);
    }, delay);
  }

  public switchRectangleState(
    animationEvent: AnimationEvent,
    animationStateRef: BehaviorSubject<string>,
    delay: number = 0
  ): void {
    if (animationEvent.fromState === ElementState.initial || animationEvent.toState === ElementState.dissapeared) {
      return;
    }
    setTimeout(() => {
      animationStateRef.next(ElementState.appeared);
    }, delay);
  }

  public hideAllElements(animationEvent: AnimationEvent, delay: number = 0): void {
    if (animationEvent.fromState === ElementState.appeared || animationEvent.toState === ElementState.dissapeared) {
      return;
    }
    setTimeout(() => {
      this.isLeftLineVisible$.next(ElementState.dissapeared);
      this.isCenterLineVisible$.next(ElementState.dissapeared);
      this.isRightLineVisible$.next(ElementState.dissapeared);
      this.isTopRectangleVisible$.next(ElementState.dissapeared);
      this.isBottomRectangleVisible$.next(ElementState.dissapeared);
    }, delay);
    const repeatDelay: number = 2000;
    this.startAnimation(repeatDelay);
  }

  private startAnimation(delay: number = 0): void {
    setTimeout(() => {
      this.isCenterLineVisible$.next(ElementState.appeared);
    }, delay);
  }
}
