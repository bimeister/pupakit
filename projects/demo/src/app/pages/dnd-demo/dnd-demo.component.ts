import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndDropData, DndItem } from '@bimeister/pupakit.overlays';

const BASE_REQUEST_PATH: string = 'dnd-demo/examples';

export interface DndData {
  itemNumber: number;
  payload: string;
}

let prevElementNumber: number = 0;
export function generateData(count: number): DndData[] {
  return Array(count)
    .fill(0)
    .map(() => ({
      itemNumber: ++prevElementNumber,
      payload: `Some item ${prevElementNumber}`,
    }));
}

export function moveDndItemsToTarget(
  dndTargetHostData: DndData[],
  dndDropData: DndDropData,
  targetHostIsSource: boolean = false
): void {
  const sourceItems: DndItem<DndData>[] = dndDropData.dndSourceItems as DndItem<DndData>[];
  const targetItem: DndItem<DndData> = dndDropData.dndTargetItem as DndItem<DndData>;

  if (targetHostIsSource) {
    removeSourceDndItems(dndTargetHostData, sourceItems);
  }

  const targetItemIndex: number = dndTargetHostData.indexOf(targetItem.data);

  dndTargetHostData.splice(
    targetItemIndex + 1,
    0,
    ...sourceItems.map((sourceItem: DndItem<DndData>) => sourceItem.data)
  );
}

export function removeSourceDndItems(dndHostData: DndData[], sourceItems: DndItem<DndData>[]): void {
  const sourceItemIndexes: number[] = sourceItems.map(({ data }: DndItem<DndData>) => dndHostData.indexOf(data));
  sourceItemIndexes.sort((firstIdx: number, secondIdx: number) => firstIdx - secondIdx);

  let deletedItemsCount: number = 0;
  for (const index of sourceItemIndexes) {
    dndHostData.splice(index - deletedItemsCount, 1);
    deletedItemsCount++;
  }
}

export function canBeDroppableFor(currentDndItem: DndItem<DndData>, dndSourceItems: DndItem<DndData>[]): boolean {
  return !dndSourceItems.map((dndSourceItem: DndItem<DndData>) => dndSourceItem.id).includes(currentDndItem.id);
}

@Component({
  selector: 'demo-dnd-demo',
  templateUrl: './dnd-demo.component.html',
  styleUrls: ['./dnd-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };
}
