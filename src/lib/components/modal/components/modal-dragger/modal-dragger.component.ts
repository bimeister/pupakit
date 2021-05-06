import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  Renderer2,
  Self
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { Position } from '../../../../../internal/declarations/types/position.type';

/** @dynamic */
@Component({
  selector: 'pupa-modal-dragger',
  templateUrl: './modal-dragger.component.html',
  styleUrls: ['./modal-dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDraggerComponent implements AfterViewInit, OnDestroy {
  private dragerToTargetStartTopPositionDelta: Position = null;
  private dragerToMousePositionDelta: Position = null;
  private mouseMoveUnlistener: EventUnlistener = null;
  private mouseUpUnlistener: EventUnlistener = null;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Self() private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(ModalRef) private readonly modalRef: ModalRef,
    private readonly renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    const selfClientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
    const targetClientRect: ClientRect = this.modalRef.getOverlayHtmlElement().getBoundingClientRect();

    this.dragerToTargetStartTopPositionDelta = [
      targetClientRect.left - selfClientRect.left,
      targetClientRect.top - selfClientRect.top
    ];
  }

  public ngOnDestroy(): void {
    ModalDraggerComponent.unlisten(this.mouseMoveUnlistener);
    ModalDraggerComponent.unlisten(this.mouseUpUnlistener);
  }

  @HostListener('mousedown', ['$event'])
  public processMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.modalRef.moveToTopLayer();
    const selfClientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.dragerToMousePositionDelta = [selfClientRect.left - event.clientX, selfClientRect.top - event.clientY];

    this.mouseMoveUnlistener = this.renderer.listen(this.document, 'mousemove', this.processMouseMove.bind(this));
    this.mouseUpUnlistener = this.renderer.listen(this.document, 'mouseup', this.processMouseUp.bind(this));
  }

  private processMouseMove(event: MouseEvent): void {
    event.stopPropagation();

    const newPosition: Position = [
      event.clientX +
        this.dragerToTargetStartTopPositionDelta[0] +
        this.dragerToMousePositionDelta[0] +
        this.getLeftOffsetByOverlayXPosition(),
      event.clientY +
        this.dragerToTargetStartTopPositionDelta[1] +
        this.dragerToMousePositionDelta[1] +
        this.getTopOffsetByOverlayYPosition()
    ];
    this.modalRef.updatePosition(newPosition);
  }

  private processMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    ModalDraggerComponent.unlisten(this.mouseMoveUnlistener);
    ModalDraggerComponent.unlisten(this.mouseUpUnlistener);
  }

  private getLeftOffsetByOverlayXPosition(): number {
    const targetClientRect: ClientRect = this.modalRef.getOverlayHtmlElement().getBoundingClientRect();

    switch (this.modalRef.getOverlayXPosition()) {
      case 'start':
      default:
        return 0;
      case 'center':
        return targetClientRect.width / 2;
      case 'end':
        return targetClientRect.width;
    }
  }

  private getTopOffsetByOverlayYPosition(): number {
    const targetClientRect: ClientRect = this.modalRef.getOverlayHtmlElement().getBoundingClientRect();

    switch (this.modalRef.getOverlayYPosition()) {
      case 'top':
      default:
        return 0;
      case 'center':
        return targetClientRect.height / 2;
      case 'bottom':
        return targetClientRect.height;
    }
  }

  private static unlisten(eventUnlistener: EventUnlistener): void {
    if (isNil(eventUnlistener)) {
      return;
    }
    eventUnlistener();
  }
}
