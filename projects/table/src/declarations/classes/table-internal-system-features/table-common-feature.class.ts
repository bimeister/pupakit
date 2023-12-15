import { ListRange } from '@angular/cdk/collections';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { QueueEvents } from '@bimeister/pupakit.common';
import { filterByInstanceOf } from '@bimeister/utilities';
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
    this.subscription.add(this.processOuterSetSetDataEvent());
    this.subscription.add(this.processOuterSetColumnDefinitionsEvent());
    this.subscription.add(this.processOuterRefreshDataSliceEvent());
    this.subscription.add(this.processOuterSetSelectedEvent());
    this.subscription.add(this.processOuterSetLoadingEvent());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processOuterSetSetDataEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetData),
        switchMap((event: TableEvents.SetData<T>) => this.displayData.setData(event.data).pipe(mapTo(event)))
      )
      .subscribe((event: TableEvents.SetData<T>) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  private processOuterSetColumnDefinitionsEvent(): Subscription {
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

  private processOuterRefreshDataSliceEvent(): Subscription {
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

  private processOuterSetSelectedEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetSelected),
        map((event: TableEvents.SetSelected) => {
          this.displayData.setSelectedIdsList(event.selectedRowTrackByIds);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetSelected) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  private processOuterSetLoadingEvent(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.SetLoading),
        map((event: TableEvents.SetLoading) => {
          this.displayData.setLoadingIdsList(event.loadingRowTrackByIds);
          return event;
        })
      )
      .subscribe((event: TableEvents.SetLoading) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }
}
