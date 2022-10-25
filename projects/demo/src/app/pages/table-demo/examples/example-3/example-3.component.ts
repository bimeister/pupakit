import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import { TableColumnDefinition, TableColumnPin, TableController, TableEvents } from '@bimeister/pupakit.table';
import { getUuid } from '@bimeister/utilities';
import { Subscription } from 'rxjs';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  date: Date;
}

const DATA: SomeData[] = Array.from({ length: 200 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  date: new Date(),
  age: index + 1,
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',

    // left side
    pin: TableColumnPin.Left,
    defaultSizes: { widthPx: 500 },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    draggable: true,
    defaultSizes: { widthPx: 350 },
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    draggable: true,
    defaultSizes: { widthPx: 350 },
  },
  {
    id: 'date',
    modelKey: 'date',
    title: 'Date',
    pin: TableColumnPin.None,
    draggable: true,
    defaultSizes: { widthPx: 350 },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',

    // right side
    pin: TableColumnPin.Right,
    defaultSizes: { widthPx: 100 },
  },
];

@Component({
  selector: 'demo-table-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample3Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  public columnDefinitions: TableColumnDefinition[] = COLUMNS;

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);

    this.subscription.add(this.processDndEnd());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processDndEnd(): Subscription {
    return this.controller.getEvents(TableEvents.ColumnDragEnd).subscribe((event: TableEvents.ColumnDragEnd) => {
      const columnDefinitions: TableColumnDefinition[] = [...this.columnDefinitions];

      columnDefinitions.splice(event.oldIndex, 1);
      columnDefinitions.splice(event.newIndex, 0, this.columnDefinitions[event.oldIndex]);

      this.controller.setColumnDefinitions(columnDefinitions);
      this.columnDefinitions = columnDefinitions;
    });
  }
}
