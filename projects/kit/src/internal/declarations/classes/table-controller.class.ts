import { Injector, TrackByFunction, Type } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterNotNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { QueueEvents } from '../events/queue.events';
import { TableEvents } from '../events/table.events';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableControllerOptions } from '../interfaces/table-controller-options.interface';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { EventsQueue } from './events-queue.class';
import { TableDataDisplayCollection } from './table-data-display-collection.class';
import TableEventBase = TableEvents.TableEventBase;

const DEFAULT_SKELETON_ROWS_COUNT: number = 100;

export class TableController<T> {
  public readonly eventBus: EventBus = new EventBus();

  protected readonly queue: EventsQueue = new EventsQueue(this.eventBus);

  protected readonly dataDisplayCollection$: BehaviorSubject<TableDataDisplayCollection<T>> = new BehaviorSubject(null);

  constructor(options?: TableControllerOptions<T>) {
    this.setHeaderRowHeightPx(options?.headerRowHeightPx);
    this.setBodyRowHeightPx(options?.bodyRowHeightPx);
    this.setScrollBehavior(options?.scrollBehavior);
    this.setTrackBy(options?.trackBy);
  }

  protected dispatchInQueue(event: TableEventBase): void {
    const queueEvent: QueueEvents.AddToQueue = new QueueEvents.AddToQueue(event);
    this.eventBus.dispatch(queueEvent);
  }

  public init(injector: Injector): void {
    const dataDisplayCollection: TableDataDisplayCollection<T> = new TableDataDisplayCollection<T>(
      this.eventBus,
      injector
    );

    this.dataDisplayCollection$.next(dataDisplayCollection);
  }

  public getEvents<E extends TableEventBase>(eventType: Type<E>): Observable<E> {
    return this.queue.getEvents(eventType);
  }

  public getDataDisplayCollectionRef(): Observable<TableDataDisplayCollectionRef<T>> {
    return this.dataDisplayCollection$.pipe(filterNotNil());
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

  public setHeaderRowHeightPx(headerRowHeightPx?: number): void {
    this.dataDisplayCollection$
      .pipe(filterNotNil(), take(1))
      .subscribe((dataDisplayCollection: TableDataDisplayCollection<T>) =>
        dataDisplayCollection.setHeaderRowHeightPx(headerRowHeightPx)
      );
  }

  public setBodyRowHeightPx(bodyRowHeightPx?: number): void {
    this.dataDisplayCollection$
      .pipe(filterNotNil(), take(1))
      .subscribe((dataDisplayCollection: TableDataDisplayCollection<T>) =>
        dataDisplayCollection.setBodyRowHeightPx(bodyRowHeightPx)
      );
  }

  public setBodyInitialCountOfSkeletonRows(countOfRows: Nullable<number> = DEFAULT_SKELETON_ROWS_COUNT): void {
    const skeletonRows: T[] = new Array(countOfRows ?? DEFAULT_SKELETON_ROWS_COUNT).fill(null);
    this.setData(skeletonRows);
  }

  private setScrollBehavior(scrollBehavior: ScrollBehavior = 'smooth'): void {
    this.dataDisplayCollection$
      .pipe(filterNotNil(), take(1))
      .subscribe((dataDisplayCollection: TableDataDisplayCollection<T>) =>
        dataDisplayCollection.scrollBehavior$.next(scrollBehavior)
      );
  }

  private setTrackBy(trackBy: TrackByFunction<T> = TableDataDisplayCollection.trackBy): void {
    this.dataDisplayCollection$
      .pipe(filterNotNil(), take(1))
      .subscribe((dataDisplayCollection: TableDataDisplayCollection<T>) =>
        dataDisplayCollection.trackBy$.next(trackBy)
      );
  }
}
