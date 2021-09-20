import { EventBus } from '@bimeister/event-bus';
import { TableDataDisplayCollection } from './table-data-display-collection.class';
import { Observable, Subscription } from 'rxjs';
import { filter, map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { QueueEvents } from '../events/queue.events';
import { TableEvents } from '../events/table.events';
import { TableColumn } from './table-column.class';
import { ListRange } from '@angular/cdk/collections';
import { Type } from '@angular/core';

export class DefaultTableEventHandler<T> {
  protected subscription: Subscription = new Subscription();

  constructor(
    protected readonly eventBus: EventBus,
    protected readonly dataDisplayCollection: TableDataDisplayCollection<T>
  ) {
    this.reconnect();
  }

  protected subscribeToEvents(): void {
    this.subscription.add(this.getSubscriptionToSetData());
    this.subscription.add(this.getSubscriptionToSetColumnDefinitions());
    this.subscription.add(this.getSubscriptionToUpdateColumnWidthByDelta());
    this.subscription.add(this.getSubscriptionToSetColumnWidth());
    this.subscription.add(this.getSubscriptionToToggleColumnSorting());
    this.subscription.add(this.getSubscriptionToSetColumnSorting());
    this.subscription.add(this.getSubscriptionToRefreshDataSlice());
    this.subscription.add(this.getSubscriptionToSetSelected());
    this.subscription.add(this.getSubscriptionToScrollByIndex());
  }

  protected getSubscriptionToSetData(): Subscription {
    return this.getEvents(TableEvents.SetData)
      .pipe(
        switchMap((event: TableEvents.SetData<T>) => {
          return this.dataDisplayCollection.setData(event.data).pipe(mapTo(event));
        })
      )
      .subscribe((event: TableEvents.SetData<T>) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
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
    return this.getEvents(TableEvents.SetSelected)
      .pipe(
        map((event: TableEvents.SetSelected) => {
          this.dataDisplayCollection.selectedIdsList$.next(event.selectedRowTrackByIds);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetSelected) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  protected getSubscriptionToScrollByIndex(): Subscription {
    return this.getEvents(TableEvents.ScrollByIndex)
      .pipe(
        map((event: TableEvents.ScrollByIndex) => {
          this.eventBus.dispatch(new TableEvents.ScrollViewportByIndex(event.index));
          return event;
        })
      )
      .subscribe((event: TableEvents.ScrollByIndex) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  public reconnect(): void {
    this.disconnect();
    this.subscribeToEvents();
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
  }

  public getEvents<E extends TableEvents.TableEventBase>(eventType: Type<E>): Observable<E> {
    return this.eventBus
      .catchEvents()
      .pipe(filter((event: TableEvents.TableEventBase): event is E => event instanceof eventType));
  }
}
