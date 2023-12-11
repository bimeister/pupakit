import { TrackByFunction } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { TableBodyRowsDataSource } from '../classes/table-body-rows-data-source.class';
import { TableColumn } from '../classes/table-column.class';
import { TableRow } from '../classes/table-row.class';
import { TableColumnDefinition } from './table-column-definition.interface';
import { TableTreeDefinition } from './table-tree-definition.interface';
import { TableBodyRowRef } from './table-body-row-ref.interface';

export interface TableDataDisplayCollectionRef<T> {
  readonly trackBy$: Observable<TrackByFunction<T>>;
  readonly scrollBehavior$: Observable<ScrollBehavior>;
  readonly data$: Observable<T[]>;
  readonly selectedIdsList$: Observable<string[]>;
  readonly headerRowHeightPx$: Observable<number>;
  readonly bodyRowHeightPx$: Observable<number>;
  readonly virtualScrollDataSource: TableBodyRowsDataSource<T>;
  readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>>;
  readonly pinnedLeftColumns$: Observable<TableColumn[]>;
  readonly scrollableColumns$: Observable<TableColumn[]>;
  readonly pinnedRightColumns$: Observable<TableColumn[]>;
  readonly headerRow: TableRow;
  readonly placeholderRow: TableRow;
  readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRowRef<T>>>;

  readonly tableWidthPx$: Observable<Nullable<number>>;
  readonly tableHeightPx$: Observable<Nullable<number>>;
  readonly tableViewportSizePx$: Observable<number>;
  readonly minBufferPx$: Observable<number>;
  readonly countOfVisibleRows$: Observable<number>;

  setData(value: T[]): Observable<T[]>;
  setSelectedIdsList(value: string[]): void;
  setColumnDefinitions(value: TableColumnDefinition[]): void;
  setTreeDefinition(value: TableTreeDefinition): void;
  setTableWidthPx(value: number): void;
  setTableHeightPx(value: number): void;
  setTableViewportSizePx(value: number): void;
  measureFirstVisibleListRange(): void;
  setHeaderRowHeightPx(value: number): void;
  setBodyRowHeightPx(value: number): void;
}
