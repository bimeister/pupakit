import { Observable } from 'rxjs';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { TableColumnDefinition } from './table-column-definition.interface';

export interface TableColumnRef {
  readonly index: number;
  readonly definition: TableColumnDefinition;
  readonly sorting$: Observable<TableColumnSorting>;
  readonly widthPx$: Observable<number>;
  readonly isHovered$: Observable<boolean>;
  readonly isCurrentResizable$: Observable<boolean>;
  readonly isCurrentDraggable$: Observable<boolean>;
  readonly isCurrentDragTarget$: Observable<boolean>;
  toggleSorting(isNoneAvailable: boolean): void;
  setSorting(sorting: TableColumnSorting): void;
  updateWidthByDeltaPx(deltaPx: number): Observable<boolean>;
  setWidth(widthPx: number): Observable<boolean>;
}
