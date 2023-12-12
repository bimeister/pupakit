import { Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, getUuid } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableRowEvents } from '../events/table-row.events';
import { TableRowRef } from '../interfaces/table-row-ref.interface';

export class TableRow implements TableRowRef {
  public readonly isHovered$: Observable<boolean> = this.listenEvent(TableRowEvents.HoverChanged).pipe(
    map((event: TableRowEvents.HoverChanged) => event.isHovered)
  );

  constructor(
    public readonly id: string = getUuid(),
    public readonly index: number = 0,
    public readonly eventBus: EventBus = new EventBus()
  ) {}

  public listenEvent<T extends TableRowEvents.TableRowEventBase>(event: Type<T>): Observable<T> {
    return this.eventBus.listen().pipe(filterByInstanceOf(event));
  }

  public dispatch(event: TableRowEvents.TableRowEventBase): void {
    this.eventBus.dispatch(event);
  }
}
