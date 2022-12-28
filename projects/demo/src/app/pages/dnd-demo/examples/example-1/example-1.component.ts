import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndDropData, DndItem, DndMoveData } from '@bimeister/pupakit.overlays';
import { canBeDroppableFor, DndData, generateData, moveDndItemsToTarget } from '../../dnd-demo.component';
import { BehaviorSubject } from 'rxjs';
import { DndCanBeDroppableForFunc } from '@bimeister/pupakit.overlays/declarations/types/dnd-can-be-droppable-for-func.type';

@Component({
  selector: 'demo-example-1',
  templateUrl: 'example-1.component.html',
  styleUrls: ['example-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example1Component {
  public readonly dndHostData: DndData[] = generateData(10);
  public readonly dndIndicatorTopPx$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public readonly canBeDroppableForFunc: DndCanBeDroppableForFunc<DndData> = canBeDroppableFor;

  public processMoved(dndMoveData: DndMoveData): void {
    if (!dndMoveData.currentHostIsSource) {
      return;
    }

    if (!dndMoveData.currentHostIsTarget) {
      this.dndIndicatorTopPx$.next(null);
      return;
    }

    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map((dndSourceItem: DndItem) => dndSourceItem.id);
    if (sourceItemIds.includes(dndMoveData.dndTargetItem.id)) {
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx$.next(null);
  }

  public processDropped(dndDropData: DndDropData): void {
    if (!dndDropData.currentHostIsSource) {
      return;
    }

    moveDndItemsToTarget(this.dndHostData, dndDropData, true);

    this.dndIndicatorTopPx$.next(null);
  }
}
