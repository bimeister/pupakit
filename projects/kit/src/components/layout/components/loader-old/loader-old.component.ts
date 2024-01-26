import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum ElementState {
  initial = 'void',
  disappeared = 'false',
  appeared = 'true',
}

@Component({
  selector: 'pupa-loader-old',
  templateUrl: './loader-old.component.html',
  styleUrls: ['./loader-old.component.scss'],
  animations: [
    trigger('lineAppeared', [
      state(
        ElementState.disappeared,
        style({
          transform: 'scale(0)',
        })
      ),
      state(
        ElementState.appeared,
        style({
          transform: 'scale(1)',
        })
      ),
      transition('false => true', animate('0.4s ease-out')),
      transition('true => false', animate('0.5s cubic-bezier(0.5, 1, 1, 1.2)')),
    ]),
    trigger('rectangleAppeared', [
      state(
        ElementState.disappeared,
        style({
          transform: 'scale(0)',
        })
      ),
      state(
        ElementState.appeared,
        style({
          transform: 'scale(1)',
        })
      ),
      transition('false => true', animate('0.5s cubic-bezier(0.2, 1, 1, 1)')),
      transition('true => false', animate('0.25s cubic-bezier(0.5, 1, 0.8, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderOldComponent implements AfterViewInit {
  public isLeftLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.disappeared);
  public isCenterLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.disappeared);
  public isRightLineVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.disappeared);
  public isTopRectangleVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.disappeared);
  public isBottomRectangleVisible$: BehaviorSubject<string> = new BehaviorSubject<string>(ElementState.disappeared);

  public ngAfterViewInit(): void {
    this.startAnimation();
  }

  public switchLineState(
    animationEvent: AnimationEvent,
    animationStateRef: BehaviorSubject<string>,
    delay: number = 0
  ): void {
    if (animationEvent.fromState === ElementState.initial || animationEvent.toState === ElementState.disappeared) {
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
    if (animationEvent.fromState === ElementState.initial || animationEvent.toState === ElementState.disappeared) {
      return;
    }
    setTimeout(() => {
      animationStateRef.next(ElementState.appeared);
    }, delay);
  }

  public hideAllElements(animationEvent: AnimationEvent, delay: number = 0): void {
    if (animationEvent.fromState === ElementState.appeared || animationEvent.toState === ElementState.disappeared) {
      return;
    }
    setTimeout(() => {
      this.isLeftLineVisible$.next(ElementState.disappeared);
      this.isCenterLineVisible$.next(ElementState.disappeared);
      this.isRightLineVisible$.next(ElementState.disappeared);
      this.isTopRectangleVisible$.next(ElementState.disappeared);
      this.isBottomRectangleVisible$.next(ElementState.disappeared);
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
