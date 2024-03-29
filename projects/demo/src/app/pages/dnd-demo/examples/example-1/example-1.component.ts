import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndCanBeDroppableForFunc, DndDropData, DndItem, DndMoveData } from '@bimeister/pupakit.dnd';
import { BehaviorSubject } from 'rxjs';
import { canBeDroppableFor, DndData, generateData, moveDndItemsToTarget } from '../../dnd-demo.component';

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

  public dndItemIdGetter(dndItem: DndData): string {
    return dndItem.itemNumber.toString();
  }
}
