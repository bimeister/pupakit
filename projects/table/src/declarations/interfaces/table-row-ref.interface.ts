import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { TableRowEvents } from '../events/table-row.events';
import { EventBus } from '@bimeister/event-bus/rxjs';

export interface TableRowRef {
  readonly id: string;
  readonly index: number;
  readonly isHovered$: Observable<boolean>;
  readonly eventBus: EventBus;

  listenEvent<T extends TableRowEvents.TableRowEventBase>(event: Type<T>): Observable<T>;
}
