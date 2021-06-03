import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { getClampedValue, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import { DropEventInterface } from '../interfaces/drop-event.interface';
import { Uuid } from '../types/uuid.type';
import { FlatTreeItem } from './flat-tree-item.class';

interface Position {
  top: number;
  left: number;
}

@Injectable()
export class TreeDragAndDropControl {
  public readonly draggingHasStarted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly droppedSubject$: Subject<DropEventInterface<FlatTreeItem>> = new Subject();
  public readonly draggableNode$: BehaviorSubject<Nullable<FlatTreeItem>> = new BehaviorSubject<Nullable<FlatTreeItem>>(
    null
  );
  public readonly scrollDirection$: BehaviorSubject<Nullable<'up' | 'down'>> = new BehaviorSubject<
    Nullable<'up' | 'down'>
  >(null);
  public readonly expandNodeWithDelay$: Subject<FlatTreeItem | null> = new Subject<FlatTreeItem | null>();

  private readonly hasDragAndDrop$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  /** @deprecated mutable object */
  private dropNode: FlatTreeItem | null;
  /** @deprecated mutable object */
  private mouseDownPosition: Position | null = null;
  /** @deprecated mutable object */
  private draggableElementBoundingBox: DOMRect | null = null;
  private draggableExpandableDescendants: Uuid[] = [];
  private renderer: Renderer2;
  private host: ElementRef<HTMLElement>;

  public setHostAndRenderer(host: ElementRef<HTMLElement>, renderer: Renderer2): void {
    this.host = host;
    this.renderer = renderer;
  }

  public setHasDragAndDrop(hasDragAndDrop: boolean): void {
    this.hasDragAndDrop$.next(hasDragAndDrop);
  }

  public mouseDown(treeNode: FlatTreeItem, event: MouseEvent): void {
    this.hasDragAndDrop$.pipe(take(1)).subscribe((hasDragAndDrop: boolean) => {
      if (!hasDragAndDrop) {
        return;
      }

      this.draggableNode$.next(treeNode);
      this.mouseDownPosition = {
        left: event.screenX,
        top: event.screenY
      };
      if (event.target instanceof HTMLElement) {
        this.draggableElementBoundingBox = event.target.getBoundingClientRect();
      }
    });
  }

  public mouseMove(
    { screenX, screenY }: MouseEvent,
    draggableElement: ElementRef<HTMLElement>,
    data$: Observable<FlatTreeItem[]>
  ): void {
    if (isNil(this.mouseDownPosition)) {
      return;
    }

    this.draggingHasStarted$.pipe(take(1)).subscribe((draggingHasStarted: boolean) => {
      const dragDistanceSqr: number =
        Math.pow(this.mouseDownPosition.left - screenX, 2) + Math.pow(this.mouseDownPosition.top - screenY, 2);

      const druggingMustBeStarted: boolean = dragDistanceSqr > this.draggableElementBoundingBox?.height / 2;
      if (!draggingHasStarted && druggingMustBeStarted) {
        this.startDragging(draggableElement, data$);
        this.draggingHasStarted$.next(true);
        this.updateDraggablePosition(screenX, screenY, draggableElement);
      }

      if (draggingHasStarted) {
        this.updateDraggablePosition(screenX, screenY, draggableElement);
      }
    });
  }

  public mouseUp(): void {
    this.draggingHasStarted$
      .pipe(take(1), withLatestFrom(this.draggableNode$))
      .subscribe(([draggingHasStarted, draggableNode]: [boolean, FlatTreeItem]) => {
        if (draggingHasStarted && !isNil(this.dropNode)) {
          this.droppedSubject$.next({
            draggedElement: draggableNode,
            droppedElement: this.dropNode
          });
        }

        this.draggingHasStarted$.next(false);
        this.draggableNode$.next(null);
        this.dropNode = null;
        this.mouseDownPosition = null;
        this.draggableElementBoundingBox = null;
        this.scrollDirection$.next(null);
        this.draggableExpandableDescendants = [];
      });
  }

  public mouseEnter(node: FlatTreeItem): void {
    this.draggingHasStarted$.pipe(take(1)).subscribe((draggingHasStarted: boolean) => {
      if (!draggingHasStarted) {
        return;
      }

      if (!node.isElement) {
        this.dropNode = node;
      }

      if (this.canDrop(node)) {
        this.expandNodeWithDelay$.next(node);
      }
    });
  }

  public canDrop(node: FlatTreeItem): boolean {
    if (isNil(node)) {
      return false;
    }
    return node.isExpandable && !this.draggableExpandableDescendants.includes(node.id);
  }

  public mouseLeave(): void {
    this.draggingHasStarted$.pipe(take(1)).subscribe((draggingHasStarted: boolean) => {
      if (!draggingHasStarted) {
        return;
      }

      this.dropNode = null;
      this.expandNodeWithDelay$.next(null);
    });
  }

  private startDragging(draggableElement: ElementRef<HTMLElement>, data$: Observable<FlatTreeItem[]>): void {
    this.setupWidthForDraggableElement(draggableElement);
    this.setupDraggableExpandableDescendants(data$);
  }

  private setupWidthForDraggableElement(draggableElement: ElementRef<HTMLElement>): void {
    timer(0)
      .pipe(take(1))
      .subscribe(() => {
        this.renderer.setStyle(draggableElement.nativeElement, 'width', `${this.draggableElementBoundingBox.width}px`);
      });
  }

  private setupDraggableExpandableDescendants(data$: Observable<FlatTreeItem[]>): void {
    data$
      .pipe(take(1), withLatestFrom(this.draggableNode$))
      .subscribe(([treeItems, draggableNode]: [FlatTreeItem[], FlatTreeItem]) => {
        const targetLevel: number = draggableNode?.level ?? 0;

        let currentIndex: number = treeItems.findIndex(dataPoint => dataPoint.id === draggableNode?.id) + 1;
        const endOfListNotReached = (): boolean => treeItems.length !== currentIndex;
        const targetLevelNotReached = (): boolean => treeItems[currentIndex].level !== targetLevel;
        const result: Uuid[] = [draggableNode?.id];

        while (endOfListNotReached() && targetLevelNotReached()) {
          const currentNode: FlatTreeItem = treeItems[currentIndex];
          if (currentNode.isExpandable) {
            result.push(currentNode.id);
          }
          currentIndex++;
        }

        this.draggableExpandableDescendants = result;
      });
  }

  private updateDraggablePosition(screenX: number, screenY: number, draggableElement: ElementRef<HTMLElement>): void {
    const draggableElementPositionShift: Position = {
      left: this.mouseDownPosition.left - this.draggableElementBoundingBox.left,
      top: this.mouseDownPosition.top - this.draggableElementBoundingBox.top
    };

    const bottomBorderPositionY: number =
      this.host.nativeElement.clientHeight - this.draggableElementBoundingBox.height;
    const draggableElementPosition: Position = {
      left: screenX - this.draggableElementBoundingBox.left - draggableElementPositionShift.left,
      top: getClampedValue(screenY - draggableElementPositionShift.top, 0, bottomBorderPositionY)
    };

    const isTopBorderReached: boolean = draggableElementPosition.top <= this.draggableElementBoundingBox.height;
    const isBottomBorderReached: boolean = draggableElementPosition.top >= bottomBorderPositionY;

    this.scrollDirection$.next(isTopBorderReached ? 'up' : isBottomBorderReached ? 'down' : null);

    if (!isNil(draggableElement)) {
      this.renderer.setStyle(draggableElement.nativeElement, 'left', `${draggableElementPosition.left}px`);
      this.renderer.setStyle(draggableElement.nativeElement, 'top', `${draggableElementPosition.top}px`);
    }
  }
}
