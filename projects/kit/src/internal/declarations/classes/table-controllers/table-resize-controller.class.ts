import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, filterTruthy, isNil } from '@bimeister/utilities';
import { asyncScheduler, merge, Observable, Subscription } from 'rxjs';
import { filter, map, observeOn, skip, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { QueueEvents } from '../../events/queue.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableEventTargetCellData } from '../../interfaces/table-event-target-cell-data.interface';
import { TableFeatureController } from '../../interfaces/table-feature-controller.interface';
import { TableColumn } from '../table-column.class';

export class TableResizeController<T> implements TableFeatureController {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> =
    this.api.displayData.columnIdToColumnMap$;

  private readonly subscription: Subscription = new Subscription();

  private currentResizableColumn: TableColumn | null = null;
  private lastDeltaPx: number = 0;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processPanStart());
    this.subscription.add(this.processPan());
    this.subscription.add(this.processPanEnd());
    this.subscription.add(this.processOuterUpdateColumnWidthByDeltaEvent());
    this.subscription.add(this.processOuterSetColumnWidthEvent());
    this.subscription.add(this.processColumnWidthChanges());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processPanStart(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.PanStart),
        filter((event: TableEvents.PanStart) => !isNil(event.targetCell) && event.triggeredByResizer)
      )
      .subscribe((event: TableEvents.PanStart) => {
        this.startResize(event.targetCell);
      });
  }

  private processPan(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.Pan))
      .subscribe((event: TableEvents.Pan) => this.updateColumnWidth(event));
  }

  private processPanEnd(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.PanEnd))
      .subscribe(() => {
        this.currentResizableColumn?.isCurrentResizable$.next(false);
        this.currentResizableColumn = null;
        this.lastDeltaPx = 0;
      });
  }

  private processOuterUpdateColumnWidthByDeltaEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.UpdateColumnWidthByDelta),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.UpdateColumnWidthByDelta, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.updateWidthByDeltaPx(event.deltaPx);
          return event;
        })
      )
      .subscribe((event: TableEvents.UpdateColumnWidthByDelta) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private processOuterSetColumnWidthEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetColumnWidth),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.SetColumnWidth, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.setWidth(event.widthPx);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetColumnWidth) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private processColumnWidthChanges(): Subscription {
    return this.columnIdToColumnMap$
      .pipe(
        switchMap((columnIdToColumnMap: Map<string, TableColumn>) => {
          const columnWidthChangesList: Observable<[string, number]>[] = Array.from(columnIdToColumnMap.values()).map(
            (column: TableColumn) =>
              column.widthPx$.pipe(
                skip(1),
                map((widthPx: number) => [column.definition.id, widthPx])
              )
          );

          return merge(...columnWidthChangesList);
        }),
        observeOn(asyncScheduler)
      )
      .subscribe(([columnId, widthPx]: [string, number]) => {
        this.eventBus.dispatch(new TableEvents.ColumnWidthChanged(widthPx, columnId));
      });
  }

  private startResize(targetCell: TableEventTargetCellData): void {
    this.columnIdToColumnMap$.pipe(take(1)).subscribe((columnIdToColumnMap: Map<string, TableColumn>) => {
      this.lastDeltaPx = 0;
      const targetColumn: TableColumn = columnIdToColumnMap.get(targetCell.columnId);
      targetColumn.isCurrentResizable$.next(true);
      this.currentResizableColumn = targetColumn;
    });
  }

  private updateColumnWidth(event: TableEvents.Pan): void {
    const deltaPx: number = event.panDelta[0] - this.lastDeltaPx;
    this.currentResizableColumn
      ?.updateWidthByDeltaPx(deltaPx)
      .pipe(filterTruthy())
      .subscribe(() => {
        this.lastDeltaPx = event.panDelta[0];
      });
  }
}
