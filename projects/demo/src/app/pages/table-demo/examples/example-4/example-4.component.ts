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
    defaultSizes: { widthPx: 200, maxWidthPx: 300, minWidthPx: 100 },
    resizable: true,
    draggable: true,

    // use type for template
    type: 'name',
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200, maxWidthPx: 300, minWidthPx: 100 },
    resizable: true,
    draggable: true,

    // use type for template
    type: 'name',
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
    draggable: true,

    // use type for template
    type: 'city',
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
    draggable: true,

    // use type for template
    type: 'age',
  },
];

@Component({
  selector: 'demo-table-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample4Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly rowType: SomeData;

  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  private columnDefinitions: TableColumnDefinition[] = COLUMNS;

  constructor() {
    this.controller.setColumnDefinitions(this.columnDefinitions);
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
