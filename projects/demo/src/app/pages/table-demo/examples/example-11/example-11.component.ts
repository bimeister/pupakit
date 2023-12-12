import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  TableColumnDefinition,
  TableColumnPin,
  TableColumnSorting,
  TableController,
  TableEvents,
  TableFeatureEvents,
  TableSortingFeature,
  TableTreeDefinition,
} from '@bimeister/pupakit.table';
import { sortByProperty } from '@bimeister/utilities';
import { Subscription } from 'rxjs';

interface SomeData {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  expandable?: boolean;
  expanded?: boolean;
  parentId?: string | null;
  level?: number;
}

const DATA: SomeData[] = [
  {
    id: '1',
    firstName: 'Azamat 1',
    lastName: 'Aitaliev 1',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: null,
    level: 0,
  },
  {
    id: '11',
    firstName: 'Azamat 11',
    lastName: 'Aitaliev 11',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '1',
    level: 1,
  },
  {
    id: '111',
    firstName: 'Azamat 111',
    lastName: 'Aitaliev 111',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '11',
    level: 2,
  },
  {
    id: '1111',
    firstName: 'Azamat 1111',
    lastName: 'Aitaliev 1111',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '111',
    level: 3,
  },
  {
    id: '1112',
    firstName: 'Azamat 1112',
    lastName: 'Aitaliev 1112',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '111',
    level: 3,
  },
  {
    id: '112',
    firstName: 'Azamat 112',
    lastName: 'Aitaliev 112',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '11',
    level: 2,
  },
  {
    id: '12',
    firstName: 'Azamat 12',
    lastName: 'Aitaliev 12',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: '1',
    level: 1,
  },
  {
    id: '121',
    firstName: 'Azamat 121',
    lastName: 'Aitaliev 121',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '12',
    level: 2,
  },
  {
    id: '2',
    firstName: 'Azamat 2',
    lastName: 'Aitaliev 2',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: null,
    level: 0,
  },
  {
    id: '3',
    firstName: 'Azamat 3',
    lastName: 'Aitaliev 3',
    city: 'Moscow',
    age: 100,
    expandable: true,
    expanded: true,
    parentId: null,
    level: 0,
  },
  {
    id: '31',
    firstName: 'Azamat 31',
    lastName: 'Aitaliev 31',
    city: 'Moscow',
    age: 100,
    expandable: false,
    expanded: false,
    parentId: '3',
    level: 1,
  },
];

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.Left,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: {
      widthPx: 200,
      minWidthPx: 70,
      maxWidthPx: 300,
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

const tableTreeDefinition: TableTreeDefinition = {
  modelIdKey: 'id',
  modelExpandableKey: 'expandable',
  modelExpandedKey: 'expanded',
  modelParentIdKey: 'parentId',
  modelLevelKey: 'level',
  treeNodeMarker: 'app-dot-single',
};

@Component({
  selector: 'demo-table-example-11',
  templateUrl: './example-11.component.html',
  styleUrls: ['./example-11.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample11Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly controller: TableController<SomeData> = new TableController<SomeData>({
    // Add predefinded sorting feature. Also you may write your own features
    features: [TableSortingFeature],
  });

  private columnDefinitions: TableColumnDefinition[] = COLUMNS;

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);
    this.controller.setTreeDefinition(tableTreeDefinition);

    this.subscription.add(this.processSortingChanges());
    this.subscription.add(this.processDndEnd());
    this.subscription.add(this.processExpandChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processExpandChanges(): Subscription {
    const data: SomeData[] = [...DATA];
    return this.controller
      .getEvents(TableFeatureEvents.ExpandRowChanged)
      .subscribe(({ expandRowInfo: { expanded, rowDataId } }: TableFeatureEvents.ExpandRowChanged) => {
        const rowDataIndex: number = data.findIndex((item: SomeData) => item.id === rowDataId);
        const row: SomeData = data[rowDataIndex];

        row.expanded = expanded;

        if (Boolean(expanded)) {
          let sliceStart: number;
          let sliceEnd: number;
          for (let index: number = 0; index < DATA.length; index++) {
            const item: SomeData = DATA[index];
            if (item.id === rowDataId) {
              sliceStart = index + 1;
              continue;
            }
            if (sliceStart !== undefined && (item.parentId === row.parentId || item.level < row.level)) {
              sliceEnd = index;
              break;
            }
          }
          const slice: SomeData[] = DATA.slice(sliceStart, sliceEnd ?? DATA.length);
          data.splice(rowDataIndex + 1, 0, ...slice);
        } else {
          const sliceStart: number = rowDataIndex + 1;
          let sliceEnd: number;
          for (let index: number = sliceStart; index < data.length; index++) {
            const item: SomeData = data[index];
            if (item.parentId === row.parentId || item.level < row.level) {
              sliceEnd = index;
              break;
            }
          }
          data.splice(sliceStart, (sliceEnd ?? DATA.length) - sliceStart);
        }
        this.controller.setData(data);
      });
  }

  private processSortingChanges(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ColumnSortingChanged)
      .subscribe(({ tableSort }: TableFeatureEvents.ColumnSortingChanged) => {
        if (tableSort.sort === TableColumnSorting.Asc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'ascending'));
          return;
        }

        if (tableSort.sort === TableColumnSorting.Desc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
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
