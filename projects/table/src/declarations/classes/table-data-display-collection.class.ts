import { ListRange } from '@angular/cdk/collections';
import { TrackByFunction } from '@angular/core';
import { isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { TableBodyRowsDataSource } from './table-body-rows-data-source.class';
import { TableColumn } from './table-column.class';
import { TableRow } from './table-row.class';
import { TableTreeDefinition } from '../interfaces/table-tree-definition.interface';
import { TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';
import { TableBodyRow } from './table-body-row.class';
import { TableBodyTreeLeafRow, TableBodyTreeNodeRow } from './table-body-tree-row.class';

interface DistributedColumns {
  leftPinnedColumns: TableColumn[];
  scrollableColumns: TableColumn[];
  rightPinnedColumns: TableColumn[];
}

const DEFAULT_ROW_HEIGHT_PX: number = 50;
const DEFAULT_MIN_BUFFER_PX: number = 100;

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
  private readonly treeDefinition$: BehaviorSubject<Nullable<TableTreeDefinition>> =
    new BehaviorSubject<TableTreeDefinition>(null);

  public readonly headerRowHeightPx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_PX);
  public readonly bodyRowHeightPx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_ROW_HEIGHT_PX);

  public readonly minBufferPx$: BehaviorSubject<number> = new BehaviorSubject<number>(DEFAULT_MIN_BUFFER_PX);
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

  private readonly selectedIdsSet$: Observable<Set<string>> = this.selectedIdsList$.pipe(
    map((selectedIdsList: string[]) => new Set<string>(selectedIdsList)),
    shareReplayWithRefCount()
  );
  public readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRowRef<T>>> = combineLatest([
    this.data$,
    this.virtualScrollDataSource.listRange$,
    this.trackBy$,
    this.treeDefinition$,
  ]).pipe(
    map(
      ([data, listRange, trackBy, treeDefinition]: [
        T[],
        ListRange,
        TrackByFunction<T>,
        TableTreeDefinition | null
      ]) => {
        const newColumnIdToColumnMap: Map<string, TableBodyRowRef<T>> = new Map<string, TableBodyRowRef<T>>();
        const dataSlice: T[] = data.slice(listRange.start, listRange.end);

        dataSlice.forEach((dataItem: T, index: number) => {
          let row: TableBodyRowRef<T>;
          const id: string = trackBy(index, dataItem);
          if (Boolean(treeDefinition)) {
            const parentId: string = dataItem[treeDefinition.modelParentIdKey];
            const isExpandable: boolean = dataItem[treeDefinition.modelIsExpandableKey];
            const isExpanded: boolean = dataItem[treeDefinition.modelIsExpandedKey];
            const level: number = dataItem[treeDefinition.modelLevelKey];

            if (Boolean(parentId)) {
              row = new TableBodyTreeLeafRow<T>(
                id,
                index + listRange.start,
                dataItem,
                this.selectedIdsSet$,
                parentId,
                level
              );
            } else {
              row = new TableBodyTreeNodeRow<T>(
                id,
                index + listRange.start,
                dataItem,
                this.selectedIdsSet$,
                parentId,
                isExpandable,
                isExpanded,
                level
              );
            }
          } else {
            row = new TableBodyRow<T>(id, index + listRange.start, dataItem, this.selectedIdsSet$);
          }
          newColumnIdToColumnMap.set(id, row);
        });

        return newColumnIdToColumnMap;
      }
    ),
    shareReplayWithRefCount()
  );

  public readonly tableWidthPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);
  public readonly tableHeightPx$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  public readonly tableViewportSizePx$: ReplaySubject<number> = new ReplaySubject<number>(1);

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

  public setTreeDefinition(definition: TableTreeDefinition): void {
    this.treeDefinition$.next(definition);
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
    combineLatest([this.bodyRowHeightPx$, this.tableViewportSizePx$, this.minBufferPx$])
      .pipe(take(1))
      .subscribe(([bodyRowHeightPx, tableViewportSizePx, minBufferPx]: [number, number, number]) => {
        const countOfVisibleRows: number = Math.ceil((tableViewportSizePx + minBufferPx * 2) / bodyRowHeightPx);
        this.countOfVisibleRows$.next(countOfVisibleRows);

        this.virtualScrollDataSource.setInitialListRange({ start: 0, end: countOfVisibleRows });
      });
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
