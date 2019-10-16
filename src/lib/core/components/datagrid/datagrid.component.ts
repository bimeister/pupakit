import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export { ColDef, GridApi, GridOptions, GridReadyEvent };

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnChanges, AfterContentChecked {
  @Input() public sizeColumnsToFit: boolean = false;

  @Input() public columnDefs: ColDef[];

  @Input() public rowData: unknown[];

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

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    this.makeColumnsFitGridWidth();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes.columnDefs)) {
      return;
    }
    const columnDefsUpdated: boolean =
      (!isNullOrUndefined(changes.columnDefs.currentValue) && isNullOrUndefined(changes.columnDefs.previousValue)) ||
      (isNullOrUndefined(changes.columnDefs.currentValue) && !isNullOrUndefined(changes.columnDefs.previousValue)) ||
      JSON.stringify(changes.columnDefs.currentValue) !== JSON.stringify(changes.columnDefs.previousValue);
    if (!columnDefsUpdated) {
      return;
    }
    this.makeColumnsFitGridWidth();
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
}
