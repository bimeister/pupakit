import { Observable } from 'rxjs';
import { TableColumnDefenition } from './table-column-defenition.interface';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export interface TableColumnRef {
  readonly definition: TableColumnDefenition;
  readonly sorting$: Observable<TableColumnSorting>;
  readonly widthPx$: Observable<number>;
  readonly isHovered$: Observable<boolean>;
  toggleSorting(isNoneAvailable: boolean): void;
  setSorting(sorting: TableColumnSorting): void;
  updateWidthByDeltaPx(deltaPx: number): Observable<boolean>;
  setWidth(widthPx: number): Observable<boolean>;
}
