import { DefaultEventHandler } from './default-event-handler.class';
import { EventBus } from '@bimeister/event-bus';
import { TableDataDisplayCollection } from './table-data-display-collection.class';
import { Subscription } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { QueueEvents } from '../events/queue.events';
import { TableEvents } from '../events/table.events';
import { TableColumn } from './table-column.class';
import { DataEvents } from '../events/data.events';
import { ListRange } from '@angular/cdk/collections';

export class DefaultTableEventHandler<T> extends DefaultEventHandler<T> {
  constructor(
    protected readonly eventBus: EventBus,
    protected readonly dataDisplayCollection: TableDataDisplayCollection<T>
  ) {
    super(eventBus, dataDisplayCollection);
  }

  protected subscribeToEvents(): void {
    super.subscribeToEvents();

    this.subscription.add(this.getSubscriptionToSetColumnDefinitions());
    this.subscription.add(this.getSubscriptionToUpdateColumnWidthByDelta());
    this.subscription.add(this.getSubscriptionToSetColumnWidth());
    this.subscription.add(this.getSubscriptionToToggleColumnSorting());
    this.subscription.add(this.getSubscriptionToSetColumnSorting());
    this.subscription.add(this.getSubscriptionToRefreshDataSlice());
    this.subscription.add(this.getSubscriptionToSetSelected());
    this.subscription.add(this.getSubscriptionToScrollByIndex());
  }

  protected getSubscriptionToSetColumnDefinitions(): Subscription {
    return this.getEvents(TableEvents.SetColumnDefinitions)
      .pipe(
        tap((event: TableEvents.SetColumnDefinitions) => {
          this.dataDisplayCollection.setColumnDefinitions(event.definitions);
        })
      )
      .subscribe((event: TableEvents.SetColumnDefinitions) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToUpdateColumnWidthByDelta(): Subscription {
    return this.getEvents(TableEvents.UpdateColumnWidthByDelta)
      .pipe(
        withLatestFrom(this.dataDisplayCollection.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.UpdateColumnWidthByDelta, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.updateWidthByDeltaPx(event.deltaPx);
          return event;
        })
      )
      .subscribe((event: TableEvents.UpdateColumnWidthByDelta) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToSetColumnWidth(): Subscription {
    return this.getEvents(TableEvents.SetColumnWidth)
      .pipe(
        withLatestFrom(this.dataDisplayCollection.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.SetColumnWidth, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.setWidth(event.widthPx);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetColumnWidth) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToToggleColumnSorting(): Subscription {
    return this.getEvents(TableEvents.ToggleColumnSorting)
      .pipe(
        withLatestFrom(this.dataDisplayCollection.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.ToggleColumnSorting, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.toggleSorting();
          return event;
        })
      )
      .subscribe((event: TableEvents.ToggleColumnSorting) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToSetColumnSorting(): Subscription {
    return this.getEvents(TableEvents.SetColumnSorting)
      .pipe(
        withLatestFrom(this.dataDisplayCollection.columnIdToColumnMap$),
        map(([event, columnIdToColumnMap]: [TableEvents.SetColumnSorting, Map<string, TableColumn>]) => {
          columnIdToColumnMap.get(event.columnId)?.setSorting(event.sorting);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetColumnSorting) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToRefreshDataSlice(): Subscription {
    return this.getEvents(TableEvents.RefreshDataSlice)
      .pipe(
        withLatestFrom(this.dataDisplayCollection.virtualScrollDataSource.listRange$),
        map(([event, listRange]: [TableEvents.RefreshDataSlice, ListRange]) => {
          this.eventBus.dispatch(new TableEvents.ListRangeChanged(listRange));
          return event;
        })
      )
      .subscribe((event: TableEvents.RefreshDataSlice) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  protected getSubscriptionToSetSelected(): Subscription {
    return this.getEvents(DataEvents.SetSelected)
      .pipe(
        map((event: DataEvents.SetSelected) => {
          this.dataDisplayCollection.selectedIdsList$.next(event.payload);
          return event;
        })
      )
      .subscribe((event: DataEvents.SetSelected) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  protected getSubscriptionToScrollByIndex(): Subscription {
    return this.getEvents(DataEvents.ScrollByIndex)
      .pipe(
        map((event: DataEvents.ScrollByIndex) => {
          this.eventBus.dispatch(new DataEvents.ScrollViewport(event.payload));
          return event;
        })
      )
      .subscribe((event: DataEvents.ScrollByIndex) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }
}
