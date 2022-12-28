import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  canBeDroppableFor,
  DndData,
  generateData,
  moveDndItemsToTarget,
  removeSourceDndItems,
} from '../../dnd-demo.component';
import { BehaviorSubject } from 'rxjs';
import { DndDropData, DndItem, DndMoveData } from '@bimeister/pupakit.overlays';
import { DndCanBeDroppableForFunc } from '@bimeister/pupakit.overlays/declarations/types/dnd-can-be-droppable-for-func.type';

@Component({
  selector: 'demo-example-2',
  templateUrl: 'example-2.component.html',
  styleUrls: ['example-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example2Component {
  public readonly dndHost1Data: DndData[] = generateData(10);
  public readonly dndHost2Data: DndData[] = generateData(10);

  public readonly dndIndicatorTopPx1$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public readonly dndIndicatorTopPx2$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  public readonly canBeDroppableForFunc: DndCanBeDroppableForFunc<DndData> = canBeDroppableFor;

  public processMoved1(dndMoveData: DndMoveData): void {
    if (!dndMoveData.currentHostIsTarget) {
      this.dndIndicatorTopPx1$.next(null);
      return;
    }

    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map((dndSourceItem: DndItem) => dndSourceItem.id);
    if (sourceItemIds.includes(dndMoveData.dndTargetItem.id)) {
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx1$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx1$.next(null);
  }

  public processDropped1(dndDropData: DndDropData): void {
    this.dndIndicatorTopPx1$.next(null);

    if (dndDropData.currentHostIsSource && dndDropData.currentHostIsTarget) {
      moveDndItemsToTarget(this.dndHost1Data, dndDropData, true);
      return;
    }

    if (dndDropData.currentHostIsSource) {
      removeSourceDndItems(this.dndHost1Data, dndDropData.dndSourceItems as DndItem<DndData>[]);
      return;
    }

    moveDndItemsToTarget(this.dndHost1Data, dndDropData);
  }

  public processMoved2(dndMoveData: DndMoveData): void {
    if (!dndMoveData.currentHostIsTarget) {
      this.dndIndicatorTopPx2$.next(null);
      return;
    }

    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map((dndSourceItem: DndItem) => dndSourceItem.id);
    if (sourceItemIds.includes(dndMoveData.dndTargetItem.id)) {
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx2$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx2$.next(null);
  }

  public processDropped2(dndDropData: DndDropData): void {
    this.dndIndicatorTopPx2$.next(null);

    if (dndDropData.currentHostIsSource && dndDropData.currentHostIsTarget) {
      moveDndItemsToTarget(this.dndHost2Data, dndDropData, true);
      return;
    }

    if (dndDropData.currentHostIsSource) {
      removeSourceDndItems(this.dndHost2Data, dndDropData.dndSourceItems as DndItem<DndData>[]);
      return;
    }

    moveDndItemsToTarget(this.dndHost2Data, dndDropData);
  }
}
