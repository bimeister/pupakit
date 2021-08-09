import { ControllerBase } from './abstract/controller-base.abstract';
import { TableColumnDefenition } from '../interfaces/table-column-defenition.interface';
import { TableDataDisplayCollection } from './table-data-display-collection.class';
import { DefaultTableEventHandler } from './default-table-event-handler.class';
import { TableEvents } from '../events/table.events';
import { TableDataDisplayCollectionRef } from '../interfaces/table-data-display-collection-ref.interface';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { DataEvents } from '../events/data.events';
import { TableControllerOptions } from '../interfaces/table-controller-options.interface';

export class TableController<T> extends ControllerBase<T, TableControllerOptions<T>> {
  protected readonly dataDisplayCollection: TableDataDisplayCollection<T>;
  protected readonly handler: DefaultTableEventHandler<T>;

  constructor(options?: TableControllerOptions<T>) {
    super(options);

    this.setRowHeightPx(options?.rowHeightPx);
  }

  protected getDataDisplayCollection(): TableDataDisplayCollection<T> {
    return new TableDataDisplayCollection<T>(this.eventBus);
  }

  protected getHandler(): DefaultTableEventHandler<T> {
    return new DefaultTableEventHandler<T>(this.eventBus, this.dataDisplayCollection);
  }

  public getDataDisplayCollectionRef(): TableDataDisplayCollectionRef<T> {
    return this.dataDisplayCollection;
  }

  public setColumnDefinitions(columnDefinitions: TableColumnDefenition[]): void {
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
    this.dispatchInQueue(new DataEvents.SetSelected(selectedIdsFromTrackBy));
  }

  public scrollByIndex(index: number): void {
    this.dispatchInQueue(new DataEvents.ScrollByIndex(index));
  }

  public setRowHeightPx(rowHeightPx?: number): void {
    this.dataDisplayCollection.setTableWidthPx(rowHeightPx);
  }
}
