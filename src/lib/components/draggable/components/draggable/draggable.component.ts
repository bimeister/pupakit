import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';

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
  private readonly subscritption: Subscription = new Subscription();

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

  private readonly draggerTargetPosition$: Observable<Position> = this.sanitizedDragger$.pipe(
    switchMap((component: DraggerComponent) => component.elementTargetPositon$),
    filter((position: Position) => Array.isArray(position))
  );

  private readonly draggerRelativeClickPosition$: Observable<Position> = this.sanitizedDragger$.pipe(
    switchMap((component: DraggerComponent) => component.elementRelativeClickPosition$),
    filter((position: Position) => Array.isArray(position))
  );

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscritption.add(this.moveDraggableElementIfDraggerPositionDoesntMatchTarget());
  }

  private moveDraggableElementIfDraggerPositionDoesntMatchTarget(): Subscription {
    return this.draggerTargetPosition$
      .pipe(
        distinctUntilChanged(
          (currentPosition: Position, targetPositon: Position) =>
            Array.isArray(currentPosition) &&
            Array.isArray(targetPositon) &&
            currentPosition.join() === targetPositon.join()
        ),
        filter(() => !isNullOrUndefined(this.elementRef) && !isNullOrUndefined(this.elementRef.nativeElement)),
        withLatestFrom(this.draggerRelativeClickPosition$, this.sanitizedDragger$)
      )
      .subscribe(([targetPositon, relativeClickPosition, _dragger]: [Position, Position, DraggerComponent]) => {
        const [targetXPx, targetYPx]: Position = targetPositon;
        const [clickRelativeXPx, clickRelativeYPx]: Position = relativeClickPosition;

        this.leftOffsetPx = targetXPx - clickRelativeXPx;
        this.topOffsetPx = targetYPx - clickRelativeYPx;

        this.changeDetectorRef.markForCheck();
      });
  }
}
