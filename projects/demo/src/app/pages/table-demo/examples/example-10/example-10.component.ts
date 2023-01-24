import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import { getUuid } from '@bimeister/utilities';
import { TableColumnDefinition, TableColumnPin, TableController } from '@bimeister/pupakit.table';
import { DndDropData, DndItem, DndItemTemplateContext, DndMoveData } from '@bimeister/pupakit.dnd/src';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
}

const DATA: SomeData[] = Array.from({ length: 200 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  age: index + 1,
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: `city`,
    modelKey: 'city',
    title: `City`,
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
  },
];

@Component({
  selector: 'demo-table-example-10',
  templateUrl: './example-10.component.html',
  styleUrls: ['./example-10.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample10Component implements AfterViewInit {
  @ViewChild('dndCloneTemplate') public dndCloneItemTemplate: TemplateRef<DndItemTemplateContext<SomeData>>;

  public readonly controller$: BehaviorSubject<TableController<SomeData> | null> =
    new BehaviorSubject<TableController<SomeData> | null>(null);

  public ngAfterViewInit(): void {
    const controller: TableController<SomeData> = new TableController<SomeData>({
      dndRowsSettings: {
        dndCloneItemTemplate: this.dndCloneItemTemplate,
        dndCloneItemsOffset: -10,
        dndItemCanBeMoved: () => true,
        dndItemCanBeDroppableFor: (currentDndItem: DndItem<SomeData>, dndDropItems: DndItem[]) =>
          !dndDropItems.map((dndDropItem: DndItem<SomeData>) => dndDropItem.id).includes(currentDndItem.id),
        dndOnMove: this.onMove.bind(this),
        dndOnDrop: this.onDrop.bind(this),
      },
    });
    controller.setColumnDefinitions(COLUMNS);
    controller.setData(DATA);

    this.controller$.next(controller);
  }

  public onMove(_dndMoveData: DndMoveData): void {
    return;
  }

  public onDrop(dndDropData: DndDropData): void {
    if (!dndDropData.currentHostIsSource && !dndDropData.currentHostIsTarget) {
      return;
    }

    this.controller$.pipe(take(1)).subscribe((controller: TableController<SomeData>) => {
      const sourceItems: DndItem<SomeData>[] = dndDropData.dndSourceItems as DndItem<SomeData>[];
      const targetItem: DndItem<SomeData> = dndDropData.dndTargetItem as DndItem<SomeData>;

      const sourceItemIndexes: number[] = sourceItems.map((sourceItem: DndItem<SomeData>) =>
        DATA.indexOf(sourceItem.data)
      );
      sourceItemIndexes.sort((index1: number, index2: number) => index1 - index2);

      let deletedCount: number = 0;
      for (const index of sourceItemIndexes) {
        DATA.splice(index - deletedCount, 1);
        deletedCount++;
      }

      const targetItemIndex: number = DATA.indexOf(targetItem.data);
      DATA.splice(targetItemIndex + 1, 0, ...sourceItems.map((sourceItem: DndItem<SomeData>) => sourceItem.data));

      controller.setData(DATA);
    });
  }
}
