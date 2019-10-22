import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams } from 'ag-grid-community';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams };

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnChanges, AfterContentChecked {
  @Input() public sizeColumnsToFit: boolean = false;

  @Input() public columnDefs: ColDef[];

  /**
   * @description standard row display; classic scrolling model;
   */
  @Input() public rowData: unknown[];

  /**
   * @description paged row display; infinite scrolling model;
   */
  @Input() public rowDataSource: IDatasource;

  @Input() public visibleColIds: string[] = [];

  @Input() public gridOptions: GridOptions = {
    rowSelection: 'single',
    defaultColDef: {
      sortable: true,
      unSortIcon: true
    }
  };

  @Input() public domLayout: 'normal' | 'autoHeight' = 'autoHeight';

  @Output() public rowClicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  private gridApi: GridApi;

  private get isGridReady(): boolean {
    return !isNullOrUndefined(this.gridApi);
  }

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    this.makeColumnsFitGridWidth();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.processColumnDefsChanges(changes);
    this.processVisibleColIdsChanges(changes);
    this.processRowDataChanges(changes);
    this.processRowDataSourceChanges(changes);
  }

  public ngAfterContentChecked(): void {
    this.makeColumnsFitGridWidth();
  }

  public handleEvent(emitter: string, data: unknown): void {
    const eventEmitter: EventEmitter<unknown> = this[emitter];
    if (isNullOrUndefined(eventEmitter)) {
      return;
    }
    eventEmitter.emit(data);
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.makeColumnsFitGridWidth();
  }

  private makeColumnsFitGridWidth(): void {
    if (isNullOrUndefined(this.gridApi)) {
      return;
    }
    this.sizeColumnsToFit ? this.gridApi.sizeColumnsToFit() : this.gridApi.doLayout();
  }

  private processRowDataSourceChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes) || !this.isValueChanged(changes.rowDataSource)) {
      return;
    }
    if (!Array.isArray(changes.rowData)) {
      return;
    }
    if (!this.isGridReady) {
      this.gridOptions.rowModelType = 'infinite';
      this.gridOptions.datasource = changes.rowDataSource.currentValue;
      return;
    }
    this.gridOptions.api.setDatasource(changes.rowData.currentValue);
  }

  private processRowDataChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes) || !this.isValueChanged(changes.rowData)) {
      return;
    }
    if (!Array.isArray(changes.rowData)) {
      return;
    }
    if (!this.isGridReady) {
      this.gridOptions.rowModelType = 'clientSide';
      this.gridOptions.rowData = changes.rowData.currentValue;
      return;
    }
    this.gridOptions.api.setRowData(changes.rowData.currentValue);
  }

  private processColumnDefsChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes) || !this.isValueChanged(changes.columnDefs)) {
      return;
    }
    this.makeColumnsFitGridWidth();
  }

  private processVisibleColIdsChanges(changes: SimpleChanges): void {
    if (
      isNullOrUndefined(changes) ||
      !this.isValueChanged(changes.visibleColIds) ||
      isNullOrUndefined(this.columnDefs)
    ) {
      return;
    }
    const visibleColumnIds: string[] = changes.visibleColIds.currentValue;
    const invisibleColumnIds: string[] = this.columnDefs
      .filter((columnDef: ColDef) => !visibleColumnIds.includes(columnDef.colId))
      .map((columnDef: ColDef) => columnDef.colId);

    this.gridOptions.columnApi.setColumnsVisible(visibleColumnIds, true);
    this.gridOptions.columnApi.setColumnsVisible(invisibleColumnIds, false);
  }

  private readonly isValueChanged = (change: SimpleChange): boolean => {
    if (isNullOrUndefined(change)) {
      return false;
    }
    const valueBecameDefined: boolean =
      isNullOrUndefined(change.previousValue) && !isNullOrUndefined(change.currentValue);
    const valueBecameUndefined: boolean =
      !isNullOrUndefined(change.previousValue) && isNullOrUndefined(change.currentValue);
    if (valueBecameDefined || valueBecameUndefined) {
      return true;
    }
    const valueIsArray: boolean = Array.isArray(change);
    const arrayLengthChanged: boolean =
      valueIsArray && !Object.is((change.currentValue as unknown[]).length, (change.previousValue as unknown[]).length);
    if (arrayLengthChanged) {
      return true;
    }
    return JSON.stringify(change.currentValue) !== JSON.stringify(change.previousValue);
  };
}
