import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  canBeDroppableFor,
  DndData,
  generateData,
  moveDndItemsToTarget,
  removeSourceDndItems,
} from '../../dnd-demo.component';
import { BehaviorSubject } from 'rxjs';
import { DndCanBeDroppableForFunc, DndDropData, DndItem, DndMoveData } from '@bimeister/pupakit.dnd';

@Component({
  selector: 'demo-example-2',
  templateUrl: 'example-2.component.html',
  styleUrls: ['example-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example2Component {
  public readonly dndHost1Id: string = 'example2DndHost1Id';
  public readonly dndHost2Id: string = 'example2DndHost2Id';

  public readonly dndHost1Data: DndData[] = generateData(10);
  public readonly dndHost2Data: DndData[] = generateData(10);

  public readonly dndIndicatorTopPx1$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public readonly dndIndicatorTopPx2$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  public readonly canBeDroppableForFunc: DndCanBeDroppableForFunc<DndData> = canBeDroppableFor;

  public readonly sourceType: DndData;
  public readonly targetType: DndData;

  public processMoved1(dndMoveData: DndMoveData<DndData, DndData>): void {
    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map(
      (dndSourceItem: DndItem<DndData>) => dndSourceItem.id
    );
    if (!dndMoveData.currentHostIsTarget || sourceItemIds.includes(dndMoveData.dndTargetItem.id)) {
      this.dndIndicatorTopPx1$.next(null);
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx1$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx1$.next(null);
  }

  public processDropped1(dndDropData: DndDropData<DndData, DndData>): void {
    if (dndDropData.dndSourceHostId !== this.dndHost1Id && dndDropData.dndSourceHostId !== this.dndHost2Id) {
      return;
    }

    if (dndDropData.dndTargetHostId !== this.dndHost1Id && dndDropData.dndTargetHostId !== this.dndHost2Id) {
      return;
    }

    this.dndIndicatorTopPx1$.next(null);

    if (dndDropData.currentHostIsSource && dndDropData.currentHostIsTarget) {
      moveDndItemsToTarget(this.dndHost1Data, dndDropData, true);
      return;
    }

    if (dndDropData.currentHostIsSource) {
      removeSourceDndItems(this.dndHost1Data, dndDropData.dndSourceItems);
      return;
    }

    moveDndItemsToTarget(this.dndHost1Data, dndDropData);
  }

  public processMoved2(dndMoveData: DndMoveData<DndData, DndData>): void {
    const sourceItemIds: string[] = dndMoveData.dndSourceItems.map(
      (dndSourceItem: DndItem<DndData>) => dndSourceItem.id
    );
    if (!dndMoveData.currentHostIsTarget || sourceItemIds.includes(dndMoveData.dndTargetItem.id)) {
      this.dndIndicatorTopPx2$.next(null);
      return;
    }

    if (dndMoveData.dndDropPosition === 'after') {
      this.dndIndicatorTopPx2$.next(dndMoveData.dndIndicatorCoords);
      return;
    }
    this.dndIndicatorTopPx2$.next(null);
  }

  public processDropped2(dndDropData: DndDropData<DndData, DndData>): void {
    if (dndDropData.dndSourceHostId !== this.dndHost1Id && dndDropData.dndSourceHostId !== this.dndHost2Id) {
      return;
    }

    if (dndDropData.dndTargetHostId !== this.dndHost1Id && dndDropData.dndTargetHostId !== this.dndHost2Id) {
      return;
    }

    this.dndIndicatorTopPx2$.next(null);

    if (dndDropData.currentHostIsSource && dndDropData.currentHostIsTarget) {
      moveDndItemsToTarget(this.dndHost2Data, dndDropData, true);
      return;
    }

    if (dndDropData.currentHostIsSource) {
      removeSourceDndItems(this.dndHost2Data, dndDropData.dndSourceItems);
      return;
    }

    moveDndItemsToTarget(this.dndHost2Data, dndDropData);
  }
}
