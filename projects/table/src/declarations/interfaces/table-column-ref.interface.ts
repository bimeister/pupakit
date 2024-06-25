import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { TableColumnEvents } from '../events/table-column.events';
import { TableColumnDefinition } from './table-column-definition.interface';

export interface TableColumnRef<TColumn = unknown> {
  readonly index: number;
  readonly definition: TableColumnDefinition<TColumn>;
  readonly widthPx$: Observable<number>;
  readonly isHovered$: Observable<boolean>;
  readonly isCurrentResizable$: Observable<boolean>;
  readonly isCurrentDraggable$: Observable<boolean>;
  readonly isCurrentDragTarget$: Observable<boolean>;

  listenEvent<T extends TableColumnEvents.TableColumnEventBase>(event: Type<T>): Observable<T>;

  dispatchEvent(event: TableColumnEvents.TableColumnEventBase): Observable<unknown>;
  dispatchEvent<R extends TableColumnEvents.TableColumnEventBase>(
    event: TableColumnEvents.TableColumnEventBase,
    response: Type<R>
  ): Observable<R>;
}
