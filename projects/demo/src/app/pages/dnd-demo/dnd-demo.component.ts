import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndDropData, DndItem } from '@bimeister/pupakit.dnd';
import { dndHostData as hostData } from './data/dnd-host.data';
import { dndMoveData as moveData } from './data/dnd-move.data';
import { dndDropData as dropData } from './data/dnd-drop.data';
import { dndItemData } from './data/dnd-item.data';

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
  dndDropData: DndDropData<DndData, DndData>,
  targetHostIsSource: boolean = false
): void {
  if (targetHostIsSource) {
    removeSourceDndItems(dndTargetHostData, dndDropData.dndSourceItems);
  }

  const targetItemIndex: number = dndTargetHostData.indexOf(dndDropData.dndTargetItem.data);

  dndTargetHostData.splice(
    targetItemIndex + 1,
    0,
    ...dndDropData.dndSourceItems.map((sourceItem: DndItem<DndData>) => sourceItem.data)
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
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
  };

  public readonly dndHostDeclaration: string = hostData;
  public readonly dndMoveDeclaration: string = moveData;
  public readonly dndDropDeclaration: string = dropData;
  public readonly dndItemDeclaration: string = dndItemData;
}
