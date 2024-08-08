import { ListRange } from '@angular/cdk/collections';
import { TrackByFunction } from '@angular/core';
import { isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
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

const DEFAULT_REM_SIZE_PX: number = 4;
const DEFAULT_ROW_HEIGHT_REM: number = 10;
const DEFAULT_MIN_BUFFER_REM: number = 25;

export class TableDataDisplayCollection<T> implements TableDataDisplayCollectionRef<T> {
  public readonly data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly selectedRowsIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public readonly disabledRowsIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public readonly trackBy$: Subject<TrackByFunction<T | null>> = new BehaviorSubject<TrackByFunction<T | null>>(
    TableDataDisplayCollection.trackBy
  );
  public readonly scrollBehavior$: BehaviorSubject<ScrollBehavior> = new BehaviorSubject<ScrollBehavior>('smooth');

  private readonly columnDefinitions$: BehaviorSubject<TableColumnDefinition[]> = new BehaviorSubject<
    TableColumnDefinition[]
  >([]);

  public readonly remSizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_REM_SIZE_PX);

  public readonly headerRowHeightRem$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_REM);
  public readonly bodyRowHeightRem$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_REM);

  public readonly minBufferRem$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_MIN_BUFFER_REM);
  public readonly countOfVisibleRows$: ReplaySubject<number> = new ReplaySubject<number>(1);

  public readonly virtualScrollDataSource: TableBodyRowsDataSource<T> = new TableBodyRowsDataSource<T>(this.data$);

  private columnIdToColumnMap: Map<string, TableColumn> = new Map<string, TableColumn>();
  public readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> = this.columnDefinitions$.pipe(
    map((definitions: TableColumnDefinition[]) => {
      const newColumnIdToColumnMap: Map<string, TableColumn> = new Map<string, TableColumn>();

      definitions.forEach((definition: TableColumnDefinition, index: number) => {
        const existingColumn: Nullable<TableColumn> = this.columnIdToColumnMap.get(definition.id);
        const column: TableColumn = isNil(existingColumn) ? new TableColumn() : existingColumn;

        column.index = index;
        column.definition = definition;

        newColumnIdToColumnMap.set(definition.id, column);
      });

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

  private readonly selectedRowsIdsSet$: Observable<Set<string>> = this.selectedRowsIds$.pipe(
    map((selectedIdsList: string[]) => new Set<string>(selectedIdsList)),
    shareReplayWithRefCount()
  );

  private readonly disabledRowsIdsSet$: Observable<Set<string>> = this.disabledRowsIds$.pipe(
    map((disabledIdsList: string[]) => new Set<string>(disabledIdsList)),
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
        const row: TableBodyRow<T> = new TableBodyRow<T>(
          id,
          index + listRange.start,
          dataItem,
          this.selectedRowsIdsSet$,
          this.disabledRowsIdsSet$
        );
        newColumnIdToColumnMap.set(id, row);
      });

      return newColumnIdToColumnMap;
    }),
    shareReplayWithRefCount()
  );

  public readonly tableWidthPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);
  public readonly tableHeightPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  public readonly tableViewportSizePx$: ReplaySubject<number> = new ReplaySubject<number>(1);

  public setData(data: T[]): Observable<T[]> {
    this.data$.next(data);
    return this.data$.pipe(take(1));
  }

  public setSelectedRowsIds(rowsIds: string[]): void {
    this.selectedRowsIds$.next(rowsIds);
  }

  public setDisabledRowsIds(rowsIds: string[]): void {
    this.disabledRowsIds$.next(rowsIds);
  }

  public setColumnDefinitions(definitions: TableColumnDefinition[]): void {
    this.columnDefinitions$.next(definitions);
  }

  public setTableWidthPx(value: number): void {
    this.tableWidthPx$.next(value);
  }

  public setTableHeightPx(value: number): void {
    this.tableHeightPx$.next(value);
  }

  public setTableViewportSizePx(value: number): void {
    this.tableViewportSizePx$.next(value);
  }

  public measureFirstVisibleListRange(): void {
    combineLatest([this.bodyRowHeightRem$, this.tableViewportSizePx$, this.minBufferRem$, this.remSizePx$])
      .pipe(take(1))
      .subscribe(
        ([bodyRowHeightRem, tableViewportSizePx, minBufferRem, remSizePx]: [number, number, number, number]) => {
          const minBufferPx: number = minBufferRem * remSizePx;
          const bodyRowHeightPx: number = bodyRowHeightRem * remSizePx;

          const countOfVisibleRows: number = Math.ceil((tableViewportSizePx + minBufferPx * 2) / bodyRowHeightPx);
          this.countOfVisibleRows$.next(countOfVisibleRows);

          this.virtualScrollDataSource.setInitialListRange({ start: 0, end: countOfVisibleRows });
        }
      );
  }

  public setHeaderRowHeightRem(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.headerRowHeightRem$.next(value);
  }

  public setBodyRowHeightRem(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.bodyRowHeightRem$.next(value);
  }

  public setRemSizePx(value?: number): void {
    if (isNil(value)) {
      return;
    }
    this.remSizePx$.next(value);
  }

  public static readonly trackBy: TrackByFunction<unknown> = <U>(index: number, _: U | null): number => index;
}
