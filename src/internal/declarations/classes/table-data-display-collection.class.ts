import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { DataDisplayCollection } from './data-display-collection.class';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { TableColumnDefenition } from '../interfaces/table-column-defenition.interface';
import { EventBus } from '@bimeister/event-bus';
import { map } from 'rxjs/operators';
import { ListRange } from '@angular/cdk/collections';
import { isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { TrackByFunction } from '@angular/core';
import { TableColumn } from './table-column.class';
import { TableBodyRowsDataSource } from './table-body-rows-data-source.class';
import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableRow } from './table-row.class';
import { TableBodyRow } from './table-body-row.class';

interface DistributedColumns {
  leftPinnedColumns: TableColumn[];
  scrollableColumns: TableColumn[];
  rightPinnedColumns: TableColumn[];
}

export class TableDataDisplayCollection<T>
  extends DataDisplayCollection<T>
  implements TableDataDisplayCollectionRef<T> {
  private readonly columnDefinitions$: BehaviorSubject<TableColumnDefenition[]> = new BehaviorSubject<
    TableColumnDefenition[]
  >([]);

  public readonly rowHeightPx$: BehaviorSubject<number> = new BehaviorSubject<number>(50);

  public readonly virtualScrollDataSource: TableBodyRowsDataSource<T> = new TableBodyRowsDataSource<T>(this.data$);

  private columnIdToColumnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
  public readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> = this.columnDefinitions$.pipe(
    map((definitions: TableColumnDefenition[]) => {
      const newColumnIdToColumnMap: Map<string, TableColumn> = new Map<string, TableColumn>();

      for (const definition of definitions) {
        const existingColumn: Nullable<TableColumn> = this.columnIdToColumnMap.get(definition.id);
        const column: TableColumn = isNil(existingColumn) ? new TableColumn() : existingColumn;
        column.definition = definition;
        newColumnIdToColumnMap.set(definition.id, column);
      }

      this.columnIdToColumnMap = newColumnIdToColumnMap;
      return this.columnIdToColumnMap;
    }),
    shareReplayWithRefCount()
  );

  private readonly distributedColumns$: Observable<DistributedColumns> = this.columnIdToColumnMap$.pipe(
    map((columnIdToColumnMap: Map<string, TableColumn>) => Array.from(columnIdToColumnMap.values())),
    map((columns: TableColumn[]) => {
      const leftPinnedColumns: TableColumn[] = [];
      const scrollableColumns: TableColumn[] = [];
      const rightPinnedColumns: TableColumn[] = [];

      for (const column of columns) {
        const columnPin: TableColumnPin = column.definition.pin;
        switch (columnPin) {
          case TableColumnPin.Left:
            leftPinnedColumns.push(column);
            continue;
          case TableColumnPin.Right:
            rightPinnedColumns.push(column);
            continue;
          default:
            scrollableColumns.push(column);
        }
      }
      return { leftPinnedColumns, scrollableColumns, rightPinnedColumns };
    }),
    shareReplayWithRefCount()
  );

  public readonly pinnedLeftColumns$: Observable<TableColumn[]> = this.distributedColumns$.pipe(
    map(({ leftPinnedColumns }: DistributedColumns) => leftPinnedColumns)
  );
  public readonly scrollableColumns$: Observable<TableColumn[]> = this.distributedColumns$.pipe(
    map(({ scrollableColumns }: DistributedColumns) => scrollableColumns)
  );
  public readonly pinnedRightColumns$: Observable<TableColumn[]> = this.distributedColumns$.pipe(
    map(({ rightPinnedColumns }: DistributedColumns) => rightPinnedColumns)
  );

  public readonly headerRow: TableRow = new TableRow();
  public readonly placeholderRow: TableRow = new TableRow();

  private readonly selectedIdsSet$: Observable<Set<string>> = this.selectedIdsList$.pipe(
    map((selectedIdsList: string[]) => new Set<string>(selectedIdsList)),
    shareReplayWithRefCount()
  );
  public readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRow<T>>> = combineLatest([
    this.data$,
    this.virtualScrollDataSource.listRange$,
    this.trackBy$
  ]).pipe(
    map(([data, listRange, trackBy]: [T[], ListRange, TrackByFunction<T>]) => {
      const newColumnIdToColumnMap: Map<string, TableBodyRow<T>> = new Map<string, TableBodyRow<T>>();

      const dataSlice: T[] = data.slice(listRange.start, listRange.end);
      dataSlice.forEach((dataItem: T, index: number) => {
        const id: string = trackBy(index, dataItem);
        const row: TableBodyRow<T> = new TableBodyRow<T>(id, dataItem, this.selectedIdsSet$);
        newColumnIdToColumnMap.set(id, row);
      });

      return newColumnIdToColumnMap;
    }),
    shareReplayWithRefCount()
  );

  public readonly tableWidthPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  constructor(public readonly eventBus: EventBus) {
    super();
  }

  public setColumnDefinitions(definitions: TableColumnDefenition[]): void {
    this.columnDefinitions$.next(definitions);
  }

  public setTableWidthPx(value: number): void {
    this.tableWidthPx$.next(value);
  }

  public setRowHeightPx(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.rowHeightPx$.next(value);
  }
}
