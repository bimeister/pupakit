import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, switchMap } from 'rxjs/operators';

import { Position } from '../../../../../internal/declarations/types/position.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { DraggerComponent } from '../dragger/dragger.component';

/** @dynamic */
@Component({
  selector: 'pupa-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableComponent {
  private readonly subscription: Subscription = new Subscription();

  @ContentChild(DraggerComponent, { static: false })
  public set draggerComponent(component: DraggerComponent) {
    this.registeredDragger$.next(component);
  }

  @HostBinding('style.left.px') public leftOffsetPx: number = null;
  @HostBinding('style.top.px') public topOffsetPx: number = null;

  private readonly registeredDragger$: BehaviorSubject<DraggerComponent> = new BehaviorSubject<DraggerComponent>(null);

  private readonly sanitizedDragger$: Observable<DraggerComponent> = this.registeredDragger$.pipe(
    filter((component: DraggerComponent) => !isNullOrUndefined(component)),
    distinctUntilChanged(),
    shareReplay(1)
  );

  private readonly draggerPositionMoveDelta$: Observable<Position> = this.sanitizedDragger$.pipe(
    switchMap((component: DraggerComponent) => component.positionMoveDelta$),
    filter((position: Position) => Array.isArray(position))
  );

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {
    this.subscription.add(this.moveDraggableElementIfDraggerPositionDoesntMatchTarget());
  }

  private moveDraggableElementIfDraggerPositionDoesntMatchTarget(): Subscription {
    return this.draggerPositionMoveDelta$.subscribe((positionMoveDelta: Position) => {
      const containerClientRect: DOMRect = this.elementRef.nativeElement.getBoundingClientRect();
      const [deltaXPx, deltaYPx]: Position = positionMoveDelta;
      this.leftOffsetPx = containerClientRect.x + deltaXPx;
      this.topOffsetPx = containerClientRect.y + deltaYPx;

      this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'fixed');
      this.renderer.setStyle(this.elementRef.nativeElement, 'right', 'unset');
      this.renderer.setStyle(this.elementRef.nativeElement, 'bottom', 'unset');

      this.changeDetectorRef.markForCheck();
    });
  }
}
