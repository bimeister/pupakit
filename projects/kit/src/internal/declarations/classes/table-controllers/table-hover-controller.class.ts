import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableFeatureController } from '../../interfaces/table-feature-controller.interface';
import { TableBodyRow } from '../table-body-row.class';
import { TableColumn } from '../table-column.class';

export class TableHoverController<T> implements TableFeatureController {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> =
    this.api.displayData.columnIdToColumnMap$;
  private readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRow<T>>> =
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
          this.currentHoveredBodyRow?.isHovered$.next(false);
          this.currentHoveredColumn?.isHovered$.next(false);

          if (isNil(event.targetCell)) {
            this.currentHoveredBodyRow = null;
            this.currentHoveredColumn = null;

            this.eventBus.dispatch(new TableEvents.RowHover(null));
            this.eventBus.dispatch(new TableEvents.ColumnHover(null));
            return;
          }

          this.currentHoveredBodyRow = bodyRowIdToBodyRowMap.get(event.targetCell.rowId);
          this.currentHoveredColumn = columnIdToColumnMap.get(event.targetCell.columnId);

          this.currentHoveredBodyRow?.isHovered$.next(true);
          this.currentHoveredColumn?.isHovered$.next(true);

          this.eventBus.dispatch(new TableEvents.RowHover(event.targetCell.rowId));
          this.eventBus.dispatch(new TableEvents.ColumnHover(event.targetCell.columnId));
        }
      );
  }
}
