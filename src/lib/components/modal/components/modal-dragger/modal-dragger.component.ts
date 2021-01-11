import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  Self
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
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
  @Input() public modalRef: ModalRef;

  @Input() public targetElementRef: ElementRef<HTMLElement>;

  private dragerToTargetStartTopPositionDelta: Position = null;
  private dragerToMousePositionDelta: Position = null;
  private mouseMoveUnlistener: EventUnlistener = null;
  private mouseUpUnlistener: EventUnlistener = null;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Self() private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    const selfClientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
    const targetCLientRect: ClientRect = this.targetElementRef.nativeElement.getBoundingClientRect();

    this.dragerToTargetStartTopPositionDelta = [
      targetCLientRect.left - selfClientRect.left,
      targetCLientRect.top - selfClientRect.top
    ];
  }

  public ngOnDestroy(): void {
    ModalDraggerComponent.unlisten(this.mouseMoveUnlistener);
    ModalDraggerComponent.unlisten(this.mouseUpUnlistener);
  }

  @HostListener('mousedown', ['$event'])
  public processMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    const selfClientRect: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
    this.dragerToMousePositionDelta = [selfClientRect.left - event.clientX, selfClientRect.top - event.clientY];

    this.mouseMoveUnlistener = this.renderer.listen(this.document, 'mousemove', this.processMouseMove.bind(this));
    this.mouseUpUnlistener = this.renderer.listen(this.document, 'mouseup', this.processMouseUp.bind(this));
  }

  private processMouseMove(event: MouseEvent): void {
    event.stopPropagation();

    const newPosition: Position = [
      event.clientX + this.dragerToTargetStartTopPositionDelta[0] + this.dragerToMousePositionDelta[0],
      event.clientY + this.dragerToTargetStartTopPositionDelta[1] + this.dragerToMousePositionDelta[1]
    ];
    this.modalRef.updatePosition(newPosition);
  }

  private processMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    ModalDraggerComponent.unlisten(this.mouseMoveUnlistener);
    ModalDraggerComponent.unlisten(this.mouseUpUnlistener);
  }

  private static unlisten(eventUnlistener: EventUnlistener): void {
    if (isNil(eventUnlistener)) {
      return;
    }
    eventUnlistener();
  }
}
