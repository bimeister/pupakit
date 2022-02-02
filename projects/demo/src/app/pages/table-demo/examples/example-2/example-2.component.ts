import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { getUuid, sortByProperty } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { TableController } from '../../../../../../../src/internal/declarations/classes/table-controller.class';
import { TableColumnPin } from '../../../../../../../src/internal/declarations/enums/table-column-pin.enum';
import { TableColumnSorting } from '../../../../../../../src/internal/declarations/enums/table-column-sorting.enum';
import { TableEvents } from '../../../../../../../src/internal/declarations/events/table.events';
import { TableColumnDefinition } from '../../../../../../../src/internal/declarations/interfaces/table-column-definition.interface';
import { Uuid } from '../../../../../../../src/internal/declarations/types/uuid.type';

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
    defaultSizes: {
      widthPx: 200,

      // use min and max sizes,
      minWidthPx: 70,
      maxWidthPx: 300,
    },

    // use type for template
    type: 'last-name',
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },

    // use type for template
    type: 'age',
  },
];

const COLUMNS_MAP: Map<string, TableColumnDefinition> = new Map<string, TableColumnDefinition>(
  COLUMNS.map((column: TableColumnDefinition) => [column.id, column])
);

@Component({
  selector: 'demo-table-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample2Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);

    this.subscription.add(this.processSortingChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processSortingChanges(): Subscription {
    return this.controller
      .getEvents(TableEvents.ColumnSortingChanged)
      .subscribe((event: TableEvents.ColumnSortingChanged) => {
        if (event.sorting === TableColumnSorting.Asc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(event.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'ascending'));
          return;
        }

        if (event.sorting === TableColumnSorting.Desc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(event.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'descending'));
          return;
        }

        this.controller.setData(DATA);
      });
  }
}
