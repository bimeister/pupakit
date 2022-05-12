import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { TableRowEvents } from '../events/table-row.events';

export interface TableRowRef {
  readonly id: string;
  readonly isHovered$: Observable<boolean>;

  listenEvent<T extends TableRowEvents.TableRowEventBase>(event: Type<T>): Observable<T>;
}
