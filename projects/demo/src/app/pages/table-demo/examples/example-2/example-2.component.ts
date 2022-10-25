import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import {
  TableColumnDefinition,
  TableColumnPin,
  TableColumnSorting,
  TableController,
  TableEvents,
  TableFeatureEvents,
  TableSortingFeature,
} from '@bimeister/pupakit.table';
import { getUuid, sortByProperty } from '@bimeister/utilities';
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
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,

    // set draggable as true
    draggable: true,

    // set resizable as true
    resizable: true,

    defaultSizes: {
      widthPx: 200,

      // use min and max sizes,
      minWidthPx: 70,
      maxWidthPx: 300,
    },

    // set sorting feature options
    featureOptions: {
      // set default state
      defaultState: TableColumnSorting.Asc,

      // set sortable as true
      sortable: true,

      // set sorting None state availability
      isSortingNoneAvailable: false,
    },
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

  public readonly controller: TableController<SomeData> = new TableController<SomeData>({
    // Add predefinded sorting feature. Also you may write your own features
    features: [TableSortingFeature],
  });

  private columnDefinitions: TableColumnDefinition[] = COLUMNS;

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);

    this.subscription.add(this.processSortingChanges());
    this.subscription.add(this.processDndEnd());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processSortingChanges(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ColumnSortingChanged)
      .subscribe((event: TableFeatureEvents.ColumnSortingChanged) => {
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
