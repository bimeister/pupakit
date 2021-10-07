import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableDataDisplayCollection } from './table-data-display-collection.class';
import { DefaultTableEventHandler } from './default-table-event-handler.class';
import { TableEvents } from '../events/table.events';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { TableControllerOptions } from '../interfaces/table-controller-options.interface';
import { EventsQueue } from './events-queue.class';
import { EventBus } from '@bimeister/event-bus';
import { QueueEvents } from '../events/queue.events';
import { TrackByFunction, Type } from '@angular/core';
import { Observable } from 'rxjs';
import TableEventBase = TableEvents.TableEventBase;

export class TableController<T> {
  public readonly eventBus: EventBus = new EventBus();

  protected readonly queue: EventsQueue = new EventsQueue(this.eventBus);

  protected readonly dataDisplayCollection: TableDataDisplayCollection<T> = new TableDataDisplayCollection<T>(
    this.eventBus
  );
  protected readonly handler: DefaultTableEventHandler<T> = new DefaultTableEventHandler<T>(
    this.eventBus,
    this.dataDisplayCollection
  );

  constructor(options?: TableControllerOptions<T>) {
    this.setRowHeightPx(options?.rowHeightPx);
    this.setScrollBehavior(options?.scrollBehavior);
    this.setTrackBy(options?.trackBy);
  }

  protected dispatchInQueue(event: TableEventBase): void {
    const queueEvent: QueueEvents.AddToQueue = new QueueEvents.AddToQueue(event);
    this.eventBus.dispatch(queueEvent);
  }

  public getEvents<E extends TableEventBase>(eventType: Type<E>): Observable<E> {
    return this.queue.getEvents(eventType);
  }

  public getDataDisplayCollectionRef(): TableDataDisplayCollectionRef<T> {
    return this.dataDisplayCollection;
  }

  public setData(data: T[]): void {
    this.dispatchInQueue(new TableEvents.SetData(data));
  }

  public setColumnDefinitions(columnDefinitions: TableColumnDefinition[]): void {
    this.dispatchInQueue(new TableEvents.SetColumnDefinitions(columnDefinitions));
  }

  public updateColumnWidthByDelta(columnId: string, deltaPx: number): void {
    this.dispatchInQueue(new TableEvents.UpdateColumnWidthByDelta(columnId, deltaPx));
  }

  public setColumnWidth(columnId: string, widthPx: number): void {
    this.dispatchInQueue(new TableEvents.SetColumnWidth(columnId, widthPx));
  }

  public toggleColumnSorting(columnId: string): void {
    this.dispatchInQueue(new TableEvents.ToggleColumnSorting(columnId));
  }

  public setColumnSorting(columnId: string, sorting: TableColumnSorting): void {
    this.dispatchInQueue(new TableEvents.SetColumnSorting(columnId, sorting));
  }

  public refreshDataSlice(): void {
    this.dispatchInQueue(new TableEvents.RefreshDataSlice());
  }

  public setSelected(...selectedIdsFromTrackBy: string[]): void {
    this.dispatchInQueue(new TableEvents.SetSelected(selectedIdsFromTrackBy));
  }

  public scrollByIndex(index: number): void {
    this.dispatchInQueue(new TableEvents.ScrollByIndex(index));
  }

  public setRowHeightPx(rowHeightPx?: number): void {
    this.dataDisplayCollection.setTableWidthPx(rowHeightPx);
  }

  private setScrollBehavior(scrollBehavior: ScrollBehavior = 'smooth'): void {
    this.dataDisplayCollection.scrollBehavior$.next(scrollBehavior);
  }

  private setTrackBy(trackBy: TrackByFunction<T> = TableDataDisplayCollection.trackBy): void {
    this.dataDisplayCollection.trackBy$.next(trackBy);
  }
}
