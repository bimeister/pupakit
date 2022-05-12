import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, filterNotNil, isNil } from '@bimeister/utilities';
import { merge, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { isTableColumnSortingOptions } from '../../../functions/type-guards/is-table-column-sorting-options.type-guard';
import { TableColumnSorting } from '../../enums/table-column-sorting.enum';
import { TableRowType } from '../../enums/table-row-type.enum';
import { QueueEvents } from '../../events/queue.events';
import { TableColumnEvents } from '../../events/table-column.events';
import { TableFeatureEvents } from '../../events/table-feature.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableEventTargetCellData } from '../../interfaces/table-event-target-cell-data.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';
import { TableColumn } from '../table-column.class';

export class TableSortingFeature<T> implements TableFeature {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> =
    this.api.displayData.columnIdToColumnMap$;

  private columnIdToColumnSortingStateMap: Map<string, TableColumnSorting> = new Map<string, TableColumnSorting>();
  private readonly subscription: Subscription = new Subscription();

  private dragStarted: boolean = false;
  private resizeStarted: boolean = false;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processCellClick());
    this.subscription.add(this.processColumnChanges());
    this.subscription.add(this.processOuterToggleColumnSortingEvent());
    this.subscription.add(this.processOuterSetColumnSortingEvent());
    this.subscription.add(this.detectDragStart());
    this.subscription.add(this.detectResizeStart());
    this.subscription.add(this.processColumnRequestSorting());
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
        filter((column: TableColumn) => {
          const featureOptions: unknown = column.definition.featureOptions;
          const isSortable: boolean = isTableColumnSortingOptions(featureOptions)
            ? featureOptions.sortable ?? true
            : false;

          return isSortable;
        })
      )
      .subscribe((column: TableColumn) => {
        const columnId: string = column.definition.id;

        this.toggleSorting(columnId);
      });
  }

  private processColumnChanges(): Subscription {
    return this.columnIdToColumnMap$.subscribe((columnIdToColumnMap: Map<string, TableColumn>) => {
      const newStatesMap: Map<string, TableColumnSorting> = new Map<string, TableColumnSorting>();

      for (const [columnId, column] of columnIdToColumnMap.entries()) {
        const featureOptions: unknown = column.definition.featureOptions;

        if (!isTableColumnSortingOptions(featureOptions)) {
          continue;
        }

        const defaultState: TableColumnSorting = featureOptions.defaultState ?? TableColumnSorting.None;

        const sortingState: TableColumnSorting = this.columnIdToColumnSortingStateMap.get(columnId) ?? defaultState;

        column.dispatchEvent(new TableColumnEvents.SortingChanged(sortingState));
        newStatesMap.set(columnId, sortingState);
      }

      this.columnIdToColumnSortingStateMap = newStatesMap;
    });
  }

  private processColumnRequestSorting(): Subscription {
    type MainStreamTuple = [TableColumnEvents.GetCurrentSorting, TableColumn, TableColumnSorting];

    return this.columnIdToColumnMap$
      .pipe(
        switchMap((columnIdToColumnMap: Map<string, TableColumn>) => {
          const streams: Observable<MainStreamTuple>[] = Array.from(columnIdToColumnMap.entries()).map(
            ([columnId, column]: [string, TableColumn]) =>
              column.listenEvent(TableColumnEvents.GetCurrentSorting).pipe(
                map((event: TableColumnEvents.GetCurrentSorting) => {
                  const currentSorting: TableColumnSorting =
                    this.columnIdToColumnSortingStateMap.get(columnId) ?? TableColumnSorting.Asc;

                  return [event, column, currentSorting];
                })
              )
          );

          return merge(...streams);
        })
      )
      .subscribe(([event, column, currentSorting]: MainStreamTuple) =>
        column.dispatchEvent(new TableColumnEvents.CurrentSortingResponse(event.id, currentSorting))
      );
  }

  private processOuterToggleColumnSortingEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableFeatureEvents.ToggleColumnSorting),
        map((event: TableFeatureEvents.ToggleColumnSorting) => {
          this.toggleSorting(event.columnId);
          return event;
        })
      )
      .subscribe((event: TableFeatureEvents.ToggleColumnSorting) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private processOuterSetColumnSortingEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableFeatureEvents.SetColumnSorting),
        map((event: TableFeatureEvents.SetColumnSorting) => {
          this.setSorting(event.columnId, event.sorting);
          return event;
        })
      )
      .subscribe((event: TableFeatureEvents.SetColumnSorting) =>
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

  private toggleSorting(columnId: string): void {
    this.columnIdToColumnMap$
      .pipe(
        take(1),
        map((columnIdToColumnMap: Map<string, TableColumn>) => columnIdToColumnMap.get(columnId)),
        filter(() => !isNil(this.columnIdToColumnSortingStateMap.get(columnId)))
      )
      .subscribe((column: TableColumn) => {
        const featureOptions: unknown = column.definition.featureOptions;
        const defaultNoneAvailability: boolean = true;

        const isNoneAvailable: boolean = isTableColumnSortingOptions(featureOptions)
          ? featureOptions.isSortingNoneAvailable ?? defaultNoneAvailability
          : defaultNoneAvailability;

        const currentSorting: TableColumnSorting = this.columnIdToColumnSortingStateMap.get(columnId);

        const sortings: TableColumnSorting[] = Object.values(TableColumnSorting);
        const currentIndex: number = sortings.indexOf(currentSorting);
        let newIndex: number = currentIndex + 1;
        if (newIndex === sortings.length) {
          newIndex = 0;
        }

        const newSorting: TableColumnSorting =
          !isNoneAvailable && sortings[newIndex] === TableColumnSorting.None
            ? sortings[newIndex + 1]
            : sortings[newIndex];

        this.setSorting(columnId, newSorting);
      });
  }

  private setSorting(columnId: string, sorting: TableColumnSorting): void {
    const currentSorting: TableColumnSorting = this.columnIdToColumnSortingStateMap.get(columnId);

    if (currentSorting === sorting) {
      return;
    }

    this.columnIdToColumnSortingStateMap.set(columnId, sorting);
    this.eventBus.dispatch(new TableFeatureEvents.ColumnSortingChanged(sorting, columnId));
    this.columnIdToColumnMap$
      .pipe(
        take(1),
        map((columnIdToColumnMap: Map<string, TableColumn>) => columnIdToColumnMap.get(columnId)),
        filterNotNil()
      )
      .subscribe((column: TableColumn) => {
        column.dispatchEvent(new TableColumnEvents.SortingChanged(sorting));
      });
  }
}
