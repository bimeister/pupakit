import { Observable } from 'rxjs';
import { TableColumnDefinition } from './table-column-definition.interface';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export interface TableColumnRef {
  readonly definition: TableColumnDefinition;
  readonly sorting$: Observable<TableColumnSorting>;
  readonly widthPx$: Observable<number>;
  readonly isHovered$: Observable<boolean>;
  toggleSorting(isNoneAvailable: boolean): void;
  setSorting(sorting: TableColumnSorting): void;
  updateWidthByDeltaPx(deltaPx: number): Observable<boolean>;
  setWidth(widthPx: number): Observable<boolean>;
}
