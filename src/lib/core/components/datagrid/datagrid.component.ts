import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent {
  @Input() public columnDefs: ColDef[];

  @Input() public rowData: unknown[];

  @Input() public gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      unSortIcon: true
    }
  };

  @Input() public domLayout: 'normal' | 'autoHeight' = 'autoHeight';

  private gridApi: GridApi;

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    if (isNullOrUndefined(this.gridApi)) {
      return;
    }
    this.makeColumnsFitGridWidth();
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.gridApi = gridReadyEvent.api;
    this.makeColumnsFitGridWidth();
  }

  private makeColumnsFitGridWidth(): void {
    this.gridApi.sizeColumnsToFit();
  }
}
