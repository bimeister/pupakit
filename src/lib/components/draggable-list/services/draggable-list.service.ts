import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CurrentDraggableListItem } from '../../../../internal/declarations/interfaces/current-draggable-list-item.interface';
import { DraggableListChangeIndexEvent } from '../../../../internal/declarations/interfaces/draggable-list-change-index-event.interface';
import { Position } from '../../../../internal/declarations/types/position.type';

const DRAGGABLE_CLONE_OFFSET_PX: number = 10;

/** @dynamic */
@Injectable()
export class DraggableListService implements OnDestroy {
  public readonly changeIndexEvent$: Subject<DraggableListChangeIndexEvent> = new Subject<DraggableListChangeIndexEvent>();

  public readonly currentDraggableListItemClone$: BehaviorSubject<HTMLElement> = new BehaviorSubject<HTMLElement>(null);
  public readonly currentDraggableListItem$: BehaviorSubject<CurrentDraggableListItem> = new BehaviorSubject<CurrentDraggableListItem>(
    null
  );
  public readonly currentDraggableListItemNewIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly availableIndexes: Set<number> = new Set<number>();

  public readonly isDragging$: Observable<boolean> = this.currentDraggableListItem$.pipe(
    map((currentDraggableListItem: CurrentDraggableListItem) => !isNil(currentDraggableListItem))
  );

  public readonly clonePosition$: BehaviorSubject<Position> = new BehaviorSubject<Position>(null);

  public readonly draggingAction$: Observable<[HTMLElement, Position, CurrentDraggableListItem]> = combineLatest([
    this.currentDraggableListItemClone$,
    this.clonePosition$,
    this.currentDraggableListItem$
  ]).pipe(
    filter(
      ([currentDraggableListItemClone, clonePosition]: [HTMLElement, Position, CurrentDraggableListItem]) =>
        !isNil(currentDraggableListItemClone) && !isNil(clonePosition)
    )
  );

  public readonly clearPlaceholdersAction$: Subject<string> = new Subject<string>();

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2, @Inject(DOCUMENT) private readonly document: Document) {
    this.subscription.add(this.handleDraggingAction());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public dragStart(listItem: CurrentDraggableListItem): void {
    this.cloneDraggableListItemElement(listItem.element);
    this.setCurrentDraggableListItem(listItem);
    this.setCursorStyle('move');
  }

  public drop(): void {
    forkJoin([this.currentDraggableListItem$.pipe(take(1)), this.currentDraggableListItemNewIndex$.pipe(take(1))])
      .pipe(
        filter(([currentDraggableListItem, _]: [CurrentDraggableListItem, number]) => !isNil(currentDraggableListItem))
      )
      .subscribe(([currentDraggableListItem, newIndex]: [CurrentDraggableListItem, number]) => {
        this.clearCurrentDraggableListItemData();
        this.clearPlaceholders();
        this.setCursorStyle('default');

        if (isNil(newIndex)) {
          return;
        }
        this.changeIndexEvent$.next({
          id: currentDraggableListItem.id,
          newIndex
        });
      });
  }

  public clearPlaceholders(callerId: string = null): void {
    this.clearPlaceholdersAction$.next(callerId);
  }

  public setNewIndex(index: number): void {
    if (index >= this.availableIndexes.size) {
      index = this.availableIndexes.size - 1;
    }
    this.currentDraggableListItemNewIndex$.next(index);
  }

  private handleDraggingAction(): Subscription {
    return this.draggingAction$.subscribe(
      ([currentDraggableListItemClone, [positionX, positionY]]: [HTMLElement, Position, CurrentDraggableListItem]) => {
        this.renderer.setStyle(currentDraggableListItemClone, 'top', `${positionY + DRAGGABLE_CLONE_OFFSET_PX}px`);
        this.renderer.setStyle(currentDraggableListItemClone, 'left', `${positionX + DRAGGABLE_CLONE_OFFSET_PX}px`);
      }
    );
  }

  private cloneDraggableListItemElement(element: HTMLElement): void {
    const clone: HTMLElement = element.cloneNode(true) as HTMLElement;
    this.renderer.addClass(clone, 'clone');
    this.currentDraggableListItemClone$.next(clone);
  }

  private setCursorStyle(style: 'default' | 'move'): void {
    this.renderer.setStyle(this.document.body, 'cursor', style, RendererStyleFlags2.Important);
  }

  private setCurrentDraggableListItem(draggableListItem: CurrentDraggableListItem): void {
    this.currentDraggableListItem$.next(draggableListItem);
  }

  private clearCurrentDraggableListItemData(): void {
    this.currentDraggableListItemClone$.next(null);
    this.currentDraggableListItem$.next(null);
    this.currentDraggableListItemNewIndex$.next(null);
  }
}
