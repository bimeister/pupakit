import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { CurrentDraggableListItem } from '../../../../../internal/declarations/interfaces/current-draggable-list-item.interface';
import { EventUnlistener } from '../../../../../internal/declarations/types/event-unlistener.type';
import { Position } from '../../../../../internal/declarations/types/position.type';
import { DraggableListService } from '../../services/draggable-list.service';

/** @dynamic */
@Component({
  selector: 'pupa-draggable-list-item',
  templateUrl: './draggable-list-item.component.html',
  styleUrls: ['./draggable-list-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableListItemComponent implements AfterViewInit, OnDestroy {
  @Input() public id: string;
  @Input() public index: number;

  public topPlaceholderIsVisible: boolean = false;
  public bottomPlaceholderIsVisible: boolean = false;

  public readonly isDragging$: Observable<boolean> = this.draggableListService.currentDraggableListItem$.pipe(
    map((currentDraggableListItem: CurrentDraggableListItem) => currentDraggableListItem?.id === this.id)
  );

  private readonly subscription: Subscription = new Subscription();

  private mouseMoveUnlistener: EventUnlistener;
  private mouseUpUnlistener: EventUnlistener;
  private touchMovelistener: EventUnlistener;
  private touchEndUnlistener: EventUnlistener;

  @HostBinding('class.is-drag-over')
  public get isDragOver(): boolean {
    return this.topPlaceholderIsVisible || this.bottomPlaceholderIsVisible;
  }

  constructor(
    public readonly draggableListItemRef: ElementRef<HTMLElement>,
    private readonly draggableListService: DraggableListService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.draggableListService.availableIndexes.add(this.index);
    this.subscription.add(this.handleDraggingAction()).add(this.handleCLearPlaceholdersAction());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  public mouseDownAndTouchStartHandler(event: Event): void {
    event.stopPropagation();
    this.listenMouseEvents();
    this.listenTouchEvents();
  }

  private listenMouseEvents(): void {
    this.mouseMoveUnlistener = this.renderer.listen(this.document, 'mousemove', (mouseMoveEvent: MouseEvent) =>
      this.mouseMoveHandler(mouseMoveEvent)
    );

    this.mouseUpUnlistener = this.renderer.listen(this.document, 'mouseup', (mouseUpEvent: MouseEvent) =>
      this.mouseUpTouchEndHandler(mouseUpEvent)
    );
  }

  private listenTouchEvents(): void {
    this.touchMovelistener = this.renderer.listen(this.document, 'touchmove', (touchMoveEvent: TouchEvent) =>
      this.touchMoveHandler(touchMoveEvent)
    );

    this.touchEndUnlistener = this.renderer.listen(this.document, 'touchend', (mouseUpEvent: MouseEvent) =>
      this.mouseUpTouchEndHandler(mouseUpEvent)
    );
  }

  private mouseMoveHandler(event: MouseEvent): void {
    event.stopPropagation();
    this.isDragging$.pipe(take(1)).subscribe((isDragging: boolean) => {
      if (!isDragging) {
        this.dragStart();
      }
      this.draggableListService.clonePosition$.next([event.clientX, event.clientY]);
    });
  }

  private touchMoveHandler(event: TouchEvent): void {
    event.stopImmediatePropagation();
    this.isDragging$.pipe(take(1)).subscribe((isDragging: boolean) => {
      if (!isDragging) {
        this.dragStart();
      }
      const touch: Touch = event.touches[0];
      this.draggableListService.clonePosition$.next([touch.clientX, touch.clientY]);
    });
  }

  private mouseUpTouchEndHandler(event: Event): void {
    event.stopPropagation();
    DraggableListItemComponent.unlisten(this.mouseMoveUnlistener);
    DraggableListItemComponent.unlisten(this.mouseUpUnlistener);
    DraggableListItemComponent.unlisten(this.touchMovelistener);
    DraggableListItemComponent.unlisten(this.touchEndUnlistener);
    this.draggableListService.drop();
  }

  private handleDraggingAction(): Subscription {
    return this.draggableListService.draggingAction$
      .pipe(
        filter(
          ([_, __, currentDraggableListItem]: [HTMLElement, Position, CurrentDraggableListItem]) =>
            !isNil(currentDraggableListItem)
        )
      )
      .subscribe(([_, position, currentDraggableListItem]: [HTMLElement, Position, CurrentDraggableListItem]) => {
        if (!DraggableListItemComponent.cursorInsideItem(position, this.draggableListItemRef.nativeElement)) {
          return;
        }
        if (currentDraggableListItem.id === this.id) {
          this.draggableListService.setNewIndex(null);
          this.draggableListService.clearPlaceholders();
          return;
        }
        this.draggableListService.setNewIndex(this.index);
        if (currentDraggableListItem.index < this.index) {
          this.showBottomPlaceholder();
          return;
        }
        this.showTopPlaceholder();
      });
  }

  private handleCLearPlaceholdersAction(): Subscription {
    return this.draggableListService.clearPlaceholdersAction$
      .pipe(filter((callerId: string) => callerId !== this.id || isNil(callerId)))
      .subscribe(() => this.clearPlaceholders());
  }

  private dragStart(): void {
    this.draggableListService.dragStart({
      id: this.id,
      index: this.index,
      element: this.draggableListItemRef.nativeElement
    });
  }

  private showTopPlaceholder(): void {
    this.draggableListService.clearPlaceholders(this.id);
    this.topPlaceholderIsVisible = true;
    this.bottomPlaceholderIsVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  private showBottomPlaceholder(): void {
    this.draggableListService.clearPlaceholders(this.id);
    this.topPlaceholderIsVisible = false;
    this.bottomPlaceholderIsVisible = true;
    this.changeDetectorRef.markForCheck();
  }

  private clearPlaceholders(): void {
    this.topPlaceholderIsVisible = false;
    this.bottomPlaceholderIsVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  private static unlisten(unlistener: EventUnlistener): void {
    if (!isNil(unlistener)) {
      unlistener();
      unlistener = null;
    }
  }

  private static cursorInsideItem([clonePositionX, clonePositionY]: Position, element: HTMLElement): boolean {
    const clientRect: ClientRect = element.getBoundingClientRect();

    const leftTopPoint: Position = [clientRect.left, clientRect.top];
    const rightBottomPoint: Position = [leftTopPoint[0] + element.offsetWidth, leftTopPoint[1] + element.offsetHeight];

    return (
      leftTopPoint[0] <= clonePositionX &&
      rightBottomPoint[0] >= clonePositionX &&
      leftTopPoint[1] <= clonePositionY &&
      rightBottomPoint[1] >= clonePositionY
    );
  }
}
