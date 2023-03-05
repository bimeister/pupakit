import { ChangeDetectionStrategy, Component } from '@angular/core';
import { canBeDroppableFor, DndData, generateData, moveDndItemsToTarget } from '../../dnd-demo.component';
import { BehaviorSubject } from 'rxjs';
import { DndCanBeDroppableForFunc, DndDropData, DndItem, DndMoveData } from '@bimeister/pupakit.dnd';

@Component({
  selector: 'demo-example-3',
  templateUrl: 'example-3.component.html',
  styleUrls: ['example-3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example3Component {
  public readonly dndHostData: DndData[] = generateData(10);
  public readonly dndIndicatorTopPx$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public readonly canBeDroppableForFunc: DndCanBeDroppableForFunc<DndData> = canBeDroppableFor;

  public readonly sourceType: DndData;
  public readonly targetType: DndData;

  public processMoved(dndMoveData: DndMoveData<DndData, DndData>): void {
    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map(
      (dndSourceItem: DndItem<DndData>) => dndSourceItem.id
    );
    if (
      !dndMoveData.currentHostIsSource ||
      !dndMoveData.currentHostIsTarget ||
      sourceItemIds.includes(dndMoveData.dndTargetItem.id)
    ) {
      this.dndIndicatorTopPx$.next(null);
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx$.next(null);
  }

  public processDropped(dndDropData: DndDropData<DndData, DndData>): void {
    if (!dndDropData.currentHostIsSource || !dndDropData.currentHostIsTarget) {
      return;
    }

    moveDndItemsToTarget(this.dndHostData, dndDropData, true);

    this.dndIndicatorTopPx$.next(null);
  }
}
