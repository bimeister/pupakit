import { ListRange } from '@angular/cdk/collections';
import { TrackByFunction } from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { TableBodyRow } from './table-body-row.class';
import { TableBodyRowsDataSource } from './table-body-rows-data-source.class';
import { TableColumn } from './table-column.class';
import { TableRow } from './table-row.class';

interface DistributedColumns {
  leftPinnedColumns: TableColumn[];
  scrollableColumns: TableColumn[];
  rightPinnedColumns: TableColumn[];
}

const DEFAULT_ROW_HEIGHT_PX: number = 50;

export class TableDataDisplayCollection<T> implements TableDataDisplayCollectionRef<T> {
  public readonly data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly selectedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public readonly trackBy$: Subject<TrackByFunction<T>> = new BehaviorSubject<TrackByFunction<T>>(
    TableDataDisplayCollection.trackBy
  );
  public readonly scrollBehavior$: BehaviorSubject<ScrollBehavior> = new BehaviorSubject('smooth');

  private readonly columnDefinitions$: BehaviorSubject<TableColumnDefinition[]> = new BehaviorSubject<
    TableColumnDefinition[]
  >([]);

  public readonly headerRowHeightPx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_PX);
  public readonly bodyRowHeightPx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_PX);

  public readonly virtualScrollDataSource: TableBodyRowsDataSource<T> = new TableBodyRowsDataSource<T>(this.data$);

  private columnIdToColumnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
  public readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> = this.columnDefinitions$.pipe(
    map((definitions: TableColumnDefinition[]) => {
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
    this.trackBy$,
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

  constructor(public readonly eventBus: EventBus) {}

  public setData(data: T[]): Observable<T[]> {
    this.data$.next(data);
    return this.data$.pipe(take(1));
  }

  public setSelectedIdsList(value: string[]): void {
    this.selectedIdsList$.next(value);
  }

  public setColumnDefinitions(definitions: TableColumnDefinition[]): void {
    this.columnDefinitions$.next(definitions);
  }

  public setTableWidthPx(value: number): void {
    this.tableWidthPx$.next(value);
  }

  public setHeaderRowHeightPx(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.headerRowHeightPx$.next(value);
  }

  public setBodyRowHeightPx(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.bodyRowHeightPx$.next(value);
  }

  public static readonly trackBy: TrackByFunction<any> = <U>(index: number, dataItem: U): string => {
    if (isNil(dataItem)) {
      return `${index}__null`;
    }
    return `${index}__${JSON.stringify(dataItem)}`;
  };
}
