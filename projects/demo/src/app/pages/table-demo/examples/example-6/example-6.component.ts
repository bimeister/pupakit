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
import { Subject, Subscription } from 'rxjs';

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
    type: 'age',
    featureOptions: {
      defaultState: TableColumnSorting.None,
      sortable: true,
      isSortingNoneAvailable: true,
    },
  },
];

const COLUMNS_MAP: Map<string, TableColumnDefinition> = new Map<string, TableColumnDefinition>(
  COLUMNS.map((column: TableColumnDefinition) => [column.id, column])
);

@Component({
  selector: 'demo-table-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample6Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly controller: TableController<SomeData> = new TableController<SomeData>({
    trackBy: (_index: number, rowData: SomeData) => rowData.id,
    features: [TableSortingFeature],
  });

  public readonly columnWidthChanged$: Subject<TableEvents.ColumnWidthChanged> =
    new Subject<TableEvents.ColumnWidthChanged>();
  public readonly columnSortingChanged$: Subject<TableFeatureEvents.ColumnSortingChanged> =
    new Subject<TableFeatureEvents.ColumnSortingChanged>();
  public readonly columnHover$: Subject<TableEvents.ColumnHover> = new Subject<TableEvents.ColumnHover>();
  public readonly rowHover$: Subject<TableEvents.RowHover> = new Subject<TableEvents.RowHover>();
  public readonly cellClick$: Subject<TableEvents.CellClick> = new Subject<TableEvents.CellClick>();
  public readonly horizontalScrollBarVisibilityChanged$: Subject<TableEvents.HorizontalScrollBarVisibilityChanged> =
    new Subject<TableEvents.HorizontalScrollBarVisibilityChanged>();
  public readonly verticalScrollBarVisibilityChanged$: Subject<TableEvents.VerticalScrollBarVisibilityChanged> =
    new Subject<TableEvents.VerticalScrollBarVisibilityChanged>();
  public readonly hiddenColumnIdsChanged$: Subject<TableEvents.HiddenColumnIdsChanged> =
    new Subject<TableEvents.HiddenColumnIdsChanged>();
  public readonly listRangeChanged$: Subject<TableEvents.ListRangeChanged> =
    new Subject<TableEvents.ListRangeChanged>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);

    this.subscription.add(this.processColumnWidthChangedEvent());
    this.subscription.add(this.processColumnSortChangedEvent());
    this.subscription.add(this.processColumnHoverEvent());
    this.subscription.add(this.processRowHoverEvent());
    this.subscription.add(this.processCellClickEvent());
    this.subscription.add(this.processHorizontalScrollBarVisibilityChangedEvent());
    this.subscription.add(this.processVerticalScrollBarVisibilityChangedEvent());
    this.subscription.add(this.processHiddenColumnIdsChangedEvent());
    this.subscription.add(this.processListRangeChangedEvent());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public addColumnToStart(): void {
    const newColumn: TableColumnDefinition = {
      id: getUuid(),
      modelKey: null,
      title: 'example',
      pin: TableColumnPin.None,
      type: 'example',
      defaultSizes: { widthPx: 1500 },
    };

    this.controller.setColumnDefinitions([newColumn, ...COLUMNS]);
  }

  public resetColumns(): void {
    this.controller.setColumnDefinitions(COLUMNS);
  }

  public changeFirstNameWidth(): void {
    this.controller.setColumnWidth('first-name', 400);
  }

  public resetFirstNameWidth(): void {
    this.controller.setColumnWidth('first-name', 200);
  }

  public toggleAgeSorting(): void {
    this.controller.dispatchFeatureEvent(new TableFeatureEvents.ToggleColumnSorting('age'));
  }

  public resetAgeSorting(): void {
    this.controller.dispatchFeatureEvent(new TableFeatureEvents.SetColumnSorting('age', TableColumnSorting.None));
  }

  public highlightSecondRow(): void {
    this.controller.setSelected(DATA[1].id);
  }

  public resetHighlighting(): void {
    this.controller.setSelected();
  }

  public scrollToIndex50(): void {
    this.controller.scrollByIndex(50);
  }

  public scrollToStart(): void {
    this.controller.scrollByIndex(0);
  }

  private processColumnWidthChangedEvent(): Subscription {
    return this.controller
      .getEvents(TableEvents.ColumnWidthChanged)
      .subscribe((event: TableEvents.ColumnWidthChanged) => {
        this.columnWidthChanged$.next(event);
      });
  }

  private processColumnSortChangedEvent(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ColumnSortingChanged)
      .subscribe((event: TableFeatureEvents.ColumnSortingChanged) => {
        this.columnSortingChanged$.next(event);

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

  private processColumnHoverEvent(): Subscription {
    return this.controller.getEvents(TableEvents.ColumnHover).subscribe((event: TableEvents.ColumnHover) => {
      this.columnHover$.next(event);
    });
  }

  private processRowHoverEvent(): Subscription {
    return this.controller.getEvents(TableEvents.RowHover).subscribe((event: TableEvents.RowHover) => {
      this.rowHover$.next(event);
    });
  }

  private processCellClickEvent(): Subscription {
    return this.controller.getEvents(TableEvents.CellClick).subscribe((event: TableEvents.CellClick) => {
      this.cellClick$.next(event);
    });
  }

  private processHorizontalScrollBarVisibilityChangedEvent(): Subscription {
    return this.controller
      .getEvents(TableEvents.HorizontalScrollBarVisibilityChanged)
      .subscribe((event: TableEvents.HorizontalScrollBarVisibilityChanged) => {
        this.horizontalScrollBarVisibilityChanged$.next(event);
      });
  }

  private processVerticalScrollBarVisibilityChangedEvent(): Subscription {
    return this.controller
      .getEvents(TableEvents.VerticalScrollBarVisibilityChanged)
      .subscribe((event: TableEvents.VerticalScrollBarVisibilityChanged) => {
        this.verticalScrollBarVisibilityChanged$.next(event);
      });
  }

  private processHiddenColumnIdsChangedEvent(): Subscription {
    return this.controller
      .getEvents(TableEvents.HiddenColumnIdsChanged)
      .subscribe((event: TableEvents.HiddenColumnIdsChanged) => {
        this.hiddenColumnIdsChanged$.next(event);
      });
  }

  private processListRangeChangedEvent(): Subscription {
    return this.controller.getEvents(TableEvents.ListRangeChanged).subscribe((event: TableEvents.ListRangeChanged) => {
      this.listRangeChanged$.next(event);
    });
  }
}
