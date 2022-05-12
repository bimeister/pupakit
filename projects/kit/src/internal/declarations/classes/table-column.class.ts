import { Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { defer, merge, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TableColumnEvents } from '../events/table-column.events';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableColumnRef } from '../interfaces/table-column-ref.interface';

export class TableColumn implements TableColumnRef {
  private readonly eventBus: EventBus = new EventBus();

  public index: number = 0;
  public definition: TableColumnDefinition;

  public readonly isHovered$: Observable<boolean> = this.listenEvent(TableColumnEvents.HoverChanged).pipe(
    map((event: TableColumnEvents.HoverChanged) => event.isHovered),
    shareReplayWithRefCount()
  );

  public readonly widthPx$: Observable<number> = defer(() =>
    merge(
      this.dispatchEvent(new TableColumnEvents.GetCurrentWidth(), TableColumnEvents.CurrentWidthResponse),
      this.listenEvent(TableColumnEvents.WidthChanged)
    )
  ).pipe(
    map((event: TableColumnEvents.CurrentWidthResponse | TableColumnEvents.WidthChanged) => event.widthPx),
    shareReplayWithRefCount()
  );

  public readonly isCurrentResizable$: Observable<boolean> = this.listenEvent(
    TableColumnEvents.CurrentResizableChanged
  ).pipe(
    map((event: TableColumnEvents.CurrentResizableChanged) => event.isCurrentResizable),
    shareReplayWithRefCount()
  );

  public readonly isCurrentDraggable$: Observable<boolean> = this.listenEvent(
    TableColumnEvents.CurrentDraggableChanged
  ).pipe(
    map((event: TableColumnEvents.CurrentDraggableChanged) => event.isCurrentDraggable),
    shareReplayWithRefCount()
  );

  public readonly isCurrentDragTarget$: Observable<boolean> = this.listenEvent(
    TableColumnEvents.CurrentDragTargetChanged
  ).pipe(
    map((event: TableColumnEvents.CurrentDragTargetChanged) => event.isCurrentDragTarget),
    shareReplayWithRefCount()
  );

  public dispatchEvent(event: TableColumnEvents.TableColumnEventBase): Observable<unknown>;

  public dispatchEvent<R extends TableColumnEvents.TableColumnEventBase>(
    event: TableColumnEvents.TableColumnEventBase,
    response: Type<R>
  ): Observable<R>;

  public dispatchEvent<R extends TableColumnEvents.TableColumnEventBase>(
    event: TableColumnEvents.TableColumnEventBase,
    response?: Type<R>
  ): Observable<R> | Observable<unknown> {
    if (isNil(response)) {
      return this.eventBus.dispatch(event);
    }

    return this.eventBus.dispatch(event).pipe(
      filter(
        (responseEvent: unknown): responseEvent is R =>
          responseEvent instanceof response && responseEvent.fromId === event.id
      ),
      take(1)
    );
  }

  public listenEvent<T extends TableColumnEvents.TableColumnEventBase>(event: Type<T>): Observable<T> {
    return this.eventBus.listen().pipe(filterByInstanceOf(event));
  }
}
