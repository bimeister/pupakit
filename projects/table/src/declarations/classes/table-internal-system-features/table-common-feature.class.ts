import { ListRange } from '@angular/cdk/collections';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { QueueEvents } from '@bimeister/pupakit.common';
import { filterByInstanceOf, getArraysDifference, isEmpty } from '@bimeister/utilities';
import { Subscription } from 'rxjs';
import { map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableDataDisplayCollectionRef } from '../../interfaces/table-data-display-collection-ref.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';

export class TableCommonFeature<T> implements TableFeature {
  private readonly subscription: Subscription = new Subscription();

  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly displayData: TableDataDisplayCollectionRef<T> = this.api.displayData;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.setDataEvent());
    this.subscription.add(this.setColumnDefinitionsEvent());
    this.subscription.add(this.refreshDataSliceEvent());
    this.subscription.add(this.selectRowsEvent());
    this.subscription.add(this.unselectRowsEvent());
    this.subscription.add(this.disableRowsEvent());
    this.subscription.add(this.enableRowsEvent());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private setDataEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetData),
        switchMap((event: TableEvents.SetData<T>) => this.displayData.setData(event.data).pipe(mapTo(event)))
      )
      .subscribe((event: TableEvents.SetData<T>) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  private setColumnDefinitionsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetColumnDefinitions),
        tap((event: TableEvents.SetColumnDefinitions) => {
          this.displayData.setColumnDefinitions(event.definitions);
        })
      )
      .subscribe((event: TableEvents.SetColumnDefinitions) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private refreshDataSliceEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.RefreshDataSlice),
        withLatestFrom(this.displayData.virtualScrollDataSource.listRange$, this.displayData.countOfVisibleRows$),
        map(([event, listRange, countOfVisibleRows]: [TableEvents.RefreshDataSlice, ListRange, number]) => {
          const targetListRange: ListRange = { ...listRange };
          if (listRange.end < countOfVisibleRows) {
            targetListRange.end = listRange.start + countOfVisibleRows;
          }
          this.eventBus.dispatch(new TableEvents.ListRangeChanged(targetListRange));
          return event;
        })
      )
      .subscribe((event: TableEvents.RefreshDataSlice) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private selectRowsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SelectRows),
        withLatestFrom(this.displayData.selectedRowsIds$),
        tap(([event, currentSelectedRowsIds]: [TableEvents.SelectRows, string[]]) => {
          if (event.isOverwrite) {
            this.displayData.setSelectedRowsIds(event.selectedRowsIds);
            return;
          }
          this.displayData.setSelectedRowsIds([...currentSelectedRowsIds, ...event.selectedRowsIds]);
        })
      )
      .subscribe(([event]: [TableEvents.SelectRows, string[]]) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private unselectRowsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.UnselectRows),
        withLatestFrom(this.displayData.selectedRowsIds$),
        tap(([event, selectedRowsIds]: [TableEvents.UnselectRows, string[]]) => {
          if (!isEmpty(event.unselectedRowsIds) && !isEmpty(selectedRowsIds)) {
            this.displayData.setSelectedRowsIds(getArraysDifference(selectedRowsIds, event.unselectedRowsIds));
          }
        })
      )
      .subscribe(([event]: [TableEvents.UnselectRows, string[]]) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private disableRowsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.DisableRows),
        withLatestFrom(this.displayData.disabledRowsIds$),
        tap(([event, currentDisabledRowsIds]: [TableEvents.DisableRows, string[]]) => {
          if (event.isOverwrite) {
            this.displayData.setDisabledRowsIds(event.disabledRowsIds);
            return;
          }
          this.displayData.setDisabledRowsIds([...currentDisabledRowsIds, ...event.disabledRowsIds]);
        })
      )
      .subscribe(([event]: [TableEvents.DisableRows, string[]]) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }

  private enableRowsEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.EnableRows),
        withLatestFrom(this.displayData.disabledRowsIds$),
        tap(([event, disabledRowsIds]: [TableEvents.EnableRows, string[]]) => {
          if (!isEmpty(event.enabledRowsIds) && !isEmpty(disabledRowsIds)) {
            this.displayData.setDisabledRowsIds(getArraysDifference(disabledRowsIds, event.enabledRowsIds));
          }
        })
      )
      .subscribe(([event]: [TableEvents.EnableRows, string[]]) =>
        this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id))
      );
  }
}
