import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, filterNotNil, isNil } from '@bimeister/utilities';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TableColumnSorting } from '../../enums/table-column-sorting.enum';
import { TableRowType } from '../../enums/table-row-type.enum';
import { QueueEvents } from '../../events/queue.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableEventTargetCellData } from '../../interfaces/table-event-target-cell-data.interface';
import { TableFeatureController } from '../../interfaces/table-feature-controller.interface';
import { TableColumn } from '../table-column.class';

export class TableSortingController<T> implements TableFeatureController {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> =
    this.api.displayData.columnIdToColumnMap$;

  private readonly subscription: Subscription = new Subscription();

  private dragStarted: boolean = false;
  private resizeStarted: boolean = false;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processCellClick());
    this.subscription.add(this.processOuterToggleColumnSortingEvent());
    this.subscription.add(this.getSubscriptionToSetColumnSorting());
    this.subscription.add(this.detectDragStart());
    this.subscription.add(this.detectResizeStart());
    this.subscription.add(this.processColumnSortingChanges());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processCellClick(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.CellClick),
        filter(() => {
          const isSortingAvailable: boolean = !this.dragStarted && !this.resizeStarted;
          this.dragStarted = false;
          this.resizeStarted = false;

          return isSortingAvailable;
        }),
        map((event: TableEvents.CellClick) => event.targetCell),
        filter((targetCell: TableEventTargetCellData) => targetCell.rowType === TableRowType.Header),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([targetCell, columnIdToColumnMap]: [TableEventTargetCellData, Map<string, TableColumn>]) =>
          columnIdToColumnMap.get(targetCell.columnId)
        ),
        filterNotNil(),
        filter((column: TableColumn) => !isNil(column.definition.sortable) && column.definition.sortable)
      )
      .subscribe((column: TableColumn) => {
        column.toggleSorting();
      });
  }

  private processOuterToggleColumnSortingEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.ToggleColumnSorting),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.ToggleColumnSorting, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.toggleSorting();
          return event;
        })
      )
      .subscribe((event: TableEvents.ToggleColumnSorting) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private getSubscriptionToSetColumnSorting(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetColumnSorting),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.SetColumnSorting, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.setSorting(event.sorting);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetColumnSorting) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private detectDragStart(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.ColumnDragStart))
      .subscribe(() => {
        this.dragStarted = true;
      });
  }

  private detectResizeStart(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.ColumnWidthChanged))
      .subscribe(() => {
        this.resizeStarted = true;
      });
  }

  private processColumnSortingChanges(): Subscription {
    return this.columnIdToColumnMap$
      .pipe(
        switchMap((columnIdToColumnMap: Map<string, TableColumn>) => {
          const columnWidthChangesList: Observable<[string, TableColumnSorting]>[] = Array.from(
            columnIdToColumnMap.values()
          ).map((column: TableColumn) =>
            column.sorting$.pipe(map((sorting: TableColumnSorting) => [column.definition.id, sorting]))
          );

          return merge(...columnWidthChangesList);
        })
      )
      .subscribe(([columnId, sorting]: [string, TableColumnSorting]) => {
        this.eventBus.dispatch(new TableEvents.ColumnSortingChanged(sorting, columnId));
      });
  }
}
