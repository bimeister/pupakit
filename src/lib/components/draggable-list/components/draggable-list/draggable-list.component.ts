import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { DraggableListChangeIndexEvent } from '../../../../../internal/declarations/interfaces/draggable-list-change-index-event.interface';
import { DraggableListService } from '../../services/draggable-list.service';

@Component({
  selector: 'pupa-draggable-list',
  templateUrl: './draggable-list.component.html',
  styleUrls: ['./draggable-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DraggableListService]
})
export class DraggableListComponent implements OnDestroy {
  @Output()
  public readonly changeIndex: EventEmitter<DraggableListChangeIndexEvent> = new EventEmitter<DraggableListChangeIndexEvent>();
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly draggableList: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly draggableListService: DraggableListService
  ) {
    this.subscription.add(this.handleCurrentDraggableListItemCloneChanges()).add(this.handleChangeIndexEvent());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleCurrentDraggableListItemCloneChanges(): Subscription {
    return this.draggableListService.currentDraggableListItemClone$
      .pipe(
        pairwise(),
        filter(([oldElement, newElement]: [HTMLElement, HTMLElement]) => !isNil(oldElement) || !isNil(newElement))
      )
      .subscribe(([oldElement, newElement]: [HTMLElement, HTMLElement]) => {
        if (isNil(newElement)) {
          this.renderer.removeChild(this.draggableList.nativeElement, oldElement);
          return;
        }
        this.renderer.appendChild(this.draggableList.nativeElement, newElement);
      });
  }

  private handleChangeIndexEvent(): Subscription {
    return this.draggableListService.changeIndexEvent$.subscribe((changeIndexEvent: DraggableListChangeIndexEvent) => {
      this.changeIndex.emit(changeIndexEvent);
    });
  }
}
