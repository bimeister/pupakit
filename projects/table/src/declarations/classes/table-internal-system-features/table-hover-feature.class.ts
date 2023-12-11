import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { TableColumnEvents } from '../../events/table-column.events';
import { TableRowEvents } from '../../events/table-row.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';
import { TableBodyRow } from '../table-body-row.class';
import { TableColumn } from '../table-column.class';
import { TableBodyRowRef } from '../../interfaces/table-body-row-ref.interface';

export class TableHoverFeature<T> implements TableFeature {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> =
    this.api.displayData.columnIdToColumnMap$;
  private readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRowRef<T>>> =
    this.api.displayData.bodyRowIdToBodyRowMap$;

  private readonly subscription: Subscription = new Subscription();

  private currentHoveredColumn: TableColumn | null = null;
  private currentHoveredBodyRow: TableBodyRow<T> | null = null;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processMouseOver());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processMouseOver(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.MouseOver),
        withLatestFrom(this.columnIdToColumnMap$, this.bodyRowIdToBodyRowMap$)
      )
      .subscribe(
        ([event, columnIdToColumnMap, bodyRowIdToBodyRowMap]: [
          TableEvents.MouseOver,
          Map<string, TableColumn>,
          Map<string, TableBodyRow<T>>
        ]) => {
          this.currentHoveredBodyRow?.dispatch(new TableRowEvents.HoverChanged(false));
          this.currentHoveredColumn?.dispatchEvent(new TableColumnEvents.HoverChanged(false));

          if (isNil(event.targetCell)) {
            this.currentHoveredBodyRow = null;
            this.currentHoveredColumn = null;

            this.eventBus.dispatch(new TableEvents.RowHover(null));
            this.eventBus.dispatch(new TableEvents.ColumnHover(null));
            return;
          }

          this.currentHoveredBodyRow = bodyRowIdToBodyRowMap.get(event.targetCell.rowId);
          this.currentHoveredColumn = columnIdToColumnMap.get(event.targetCell.columnId);

          this.currentHoveredBodyRow?.dispatch(new TableRowEvents.HoverChanged(true));
          this.currentHoveredColumn?.dispatchEvent(new TableColumnEvents.HoverChanged(true));

          this.eventBus.dispatch(new TableEvents.RowHover(event.targetCell.rowId));
          this.eventBus.dispatch(new TableEvents.ColumnHover(event.targetCell.columnId));
        }
      );
  }
}
