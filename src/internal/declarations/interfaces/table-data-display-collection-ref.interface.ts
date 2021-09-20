import { Observable } from 'rxjs';
import { TableColumnDefenition } from './table-column-defenition.interface';
import { Nullable } from '@bimeister/utilities';
import { TableBodyRowsDataSource } from '../classes/table-body-rows-data-source.class';
import { TableColumn } from '../classes/table-column.class';
import { TableRow } from '../classes/table-row.class';
import { TableBodyRow } from '../classes/table-body-row.class';
import { TrackByFunction } from '@angular/core';

export interface TableDataDisplayCollectionRef<T> {
  readonly trackBy$: Observable<TrackByFunction<T>>;
  readonly scrollBehavior$: Observable<ScrollBehavior>;
  readonly data$: Observable<T[]>;
  readonly selectedIdsList$: Observable<string[]>;
  readonly rowHeightPx$: Observable<number>;
  readonly virtualScrollDataSource: TableBodyRowsDataSource<T>;
  readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>>;
  readonly pinnedLeftColumns$: Observable<TableColumn[]>;
  readonly scrollableColumns$: Observable<TableColumn[]>;
  readonly pinnedRightColumns$: Observable<TableColumn[]>;
  readonly headerRow: TableRow;
  readonly placeholderRow: TableRow;
  readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRow<T>>>;

  readonly tableWidthPx$: Observable<Nullable<number>>;

  setData(value: T[]): Observable<T[]>;
  setSelectedIdsList(value: string[]): void;
  setColumnDefinitions(value: TableColumnDefenition[]): void;
  setTableWidthPx(value: number): void;
  setRowHeightPx(value: number): void;
}
