import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Position } from '../../../../../internal/declarations/types/position.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

/** @dynamic */
@Component({
  selector: 'pupa-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggerComponent {
  public readonly elementTargetPositon$: BehaviorSubject<Position> = new BehaviorSubject<Position>(null);
  public readonly elementRelativeClickPosition$: BehaviorSubject<Position> = new BehaviorSubject<Position>(null);
  private readonly eventUnlistener$: BehaviorSubject<VoidFunction> = new BehaviorSubject<VoidFunction>(null);

  private get elementClientRect(): ClientRect {
    if (DraggerComponent.notRendered(this.elementRef)) {
      return {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
      };
    }

    const nativeElement: HTMLElement = this.elementRef.nativeElement;
    return nativeElement.getBoundingClientRect();
  }

  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  @HostListener('mousedown', ['$event'])
  public processMouseDown(event: MouseEvent): void {
    this.cancelPreviousListener();
    this.createNewListener();
    this.setRelativeClickPosition(event);
  }

  @HostListener('window:mouseup')
  public processMouseUp(): void {
    this.cancelPreviousListener();
    this.clearClickPosition();
  }

  private cancelPreviousListener(): void {
    this.eventUnlistener$
      .pipe(
        take(1),
        filter((unlisten: VoidFunction) => !isNullOrUndefined(unlisten))
      )
      .subscribe((unlisten: VoidFunction) => unlisten());
  }

  private clearClickPosition(): void {
    this.elementRelativeClickPosition$.next(null);
  }

  private createNewListener(): void {
    const unlisten: VoidFunction = this.renderer.listen('document', 'mousemove', (event: MouseEvent) =>
      this.updateTargetPosition(event)
    );

    this.eventUnlistener$.next(unlisten);
  }

  private updateTargetPosition(event: MouseEvent): void {
    this.elementRelativeClickPosition$.pipe(take(1)).subscribe(([clickOffsetXPx, clickOffsetYPx]: [number, number]) => {
      const mouseXPx: number = event.pageX;
      const mouseYPx: number = event.pageY;

      const bodyClientRect: ClientRect = this.document.body.getBoundingClientRect();
      const draggerClientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();

      const maxXPx: number = bodyClientRect.width - draggerClientRect.width + clickOffsetXPx;
      const maxYPx: number = bodyClientRect.height - draggerClientRect.height + clickOffsetYPx;

      const minXPx: number = clickOffsetXPx;
      const minYPx: number = clickOffsetYPx;

      const sanitizedPositionXPx: number = DraggerComponent.getSanitizedValue(mouseXPx, minXPx, maxXPx);
      const sanitizedPositionYPx: number = DraggerComponent.getSanitizedValue(mouseYPx, minYPx, maxYPx);

      this.elementTargetPositon$.next([sanitizedPositionXPx, sanitizedPositionYPx]);
    });
  }

  private setRelativeClickPosition(event: MouseEvent): void {
    if (DraggerComponent.notRendered(this.elementRef)) {
      this.elementRelativeClickPosition$.next([0, 0]);
      return;
    }

    const { left, top }: ClientRect = this.elementClientRect;
    const { offsetLeft, offsetTop }: HTMLElement = this.elementRef.nativeElement;

    const offsetXPx: number = event.pageX - left + offsetLeft;
    const offsetYPx: number = event.pageY - top + offsetTop;

    this.elementRelativeClickPosition$.next([offsetXPx, offsetYPx]);
  }

  private static notRendered(elementRef: ElementRef<HTMLElement>): boolean {
    return isNullOrUndefined(elementRef?.nativeElement);
  }

  private static getSanitizedValue(value: number, min: number, max: number): number {
    if (isNullOrUndefined(value) || typeof value !== 'number' || value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }
}
