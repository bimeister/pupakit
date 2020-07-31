import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';

import { ModalWindowData } from '../../../../../internal/declarations/interfaces/modal-window-data.interface';
import { ModalWindowService } from '../../services/modal-window.service';

interface MouseDeltaPosition {
  pageX: number;
  pageY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  translateX: number;
  translateY: number;
}

/** @dynamic */
@Component({
  selector: 'pupa-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openWindow', [
      state('false', style({ opacity: `0` })),
      state('true', style({ opacity: `1` })),
      transition('false => true', animate('0.2s')),
      transition('true => false', animate('0.2s'))
    ])
  ]
})
export class ModalWindowComponent implements AfterViewInit {
  @Input()
  public readonly modalWindowData: ModalWindowData;

  @ViewChild('modalWindowBlock', { static: true })
  public modalWindowBlock: ElementRef<HTMLDivElement>;

  @ViewChild('modalWindowWrapper', { static: true })
  public modalWindowWrapper: ElementRef<HTMLDivElement>;

  @ViewChild('container', { read: ViewContainerRef, static: true })
  public readonly container: ViewContainerRef;

  public isOpened: boolean = false;

  private isStarted: boolean = true;

  private readonly deltaPosition: MouseDeltaPosition = {
    pageX: 0,
    pageY: 0,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    translateX: 0,
    translateY: 0
  };

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly modalWindowService: ModalWindowService,
    private readonly renderer: Renderer2,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.container.createComponent(this.modalWindowData.componentFactory, 0, this.modalWindowData.injector);
    this.isOpened = true;
    this.changeDetector.detectChanges();
  }

  public get needTitleBlock(): boolean {
    return !isNil(this.modalWindowData.title) || this.modalWindowData.canMove || this.modalWindowData.closeButton;
  }

  public get isPadding(): string {
    if (!this.modalWindowData.canPadding) {
      return null;
    }
    if (this.needTitleBlock) {
      return 'title-padding';
    }
    return 'all-padding';
  }

  public processOverlayClick(): void {
    if (isNil(this.modalWindowData.clickableOverlay) || !this.modalWindowData.clickableOverlay) {
      return;
    }
    this.closeWindow();
  }

  public closeWindow(): void {
    this.isStarted = false;
    this.isOpened = false;
    this.changeDetector.detectChanges();
  }

  public animationDone(animationDone: boolean): void {
    if (!animationDone || this.isStarted) {
      return;
    }
    this.modalWindowService.closeModalWindowById(this.modalWindowData.id);
  }

  public processAnimationEnd(event: AnimationEvent): void {
    const animationDone: boolean = String(event.toState) === 'false';
    if (!animationDone) {
      return;
    }
    this.animationDone(animationDone);
  }

  public moveInitialization(event: MouseEvent): void {
    event.stopPropagation();
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    const box: ClientRect = this.modalWindowBlock.nativeElement.getBoundingClientRect();
    const wrapper: ClientRect = this.modalWindowWrapper.nativeElement.getBoundingClientRect();
    this.deltaPosition.pageX = event.pageX;
    this.deltaPosition.pageY = event.pageY;
    this.deltaPosition.minX = this.deltaPosition.pageX - wrapper.left - box.left;
    this.deltaPosition.maxX = this.deltaPosition.pageX + (wrapper.width - box.right);
    this.deltaPosition.minY = this.deltaPosition.pageY - wrapper.top - box.top;
    this.deltaPosition.maxY = this.deltaPosition.pageY + (wrapper.height - box.bottom);
    this.document.addEventListener('mousemove', this.onMouseMove, true);
    this.document.addEventListener('mouseup', this.onMouseUp, true);
  }

  public readonly onMouseMove = (event: MouseEvent): void => {
    event.stopPropagation();
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    const newPageX: number = this.getNewPositionX(event.pageX, this.deltaPosition.minX, this.deltaPosition.maxX);
    const newPageY: number = this.getNewPositionX(event.pageY, this.deltaPosition.minY, this.deltaPosition.maxY);
    const deltaX: number = newPageX - this.deltaPosition.pageX;
    const deltaY: number = newPageY - this.deltaPosition.pageY;
    this.deltaPosition.pageX = newPageX;
    this.deltaPosition.pageY = newPageY;
    this.deltaPosition.translateX += deltaX;
    this.deltaPosition.translateY += deltaY;
    this.renderer.setStyle(
      this.modalWindowBlock.nativeElement,
      'transform',
      `translate(${this.deltaPosition.translateX}px, ${this.deltaPosition.translateY}px)`
    );
  };

  public readonly onMouseUp = (event: MouseEvent): void => {
    event.stopPropagation();
    this.document.removeEventListener('mousemove', this.onMouseMove, true);
    this.document.removeEventListener('mouseup', this.onMouseUp, true);
  };

  private readonly getNewPositionX = (position: number, min: number, max: number): number => {
    return position < min ? min : position > max ? max : position;
  };
}
