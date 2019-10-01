import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ColumnDefs {
  headerName: string;
  field: string;
}

export interface RowData {
  [field: string]: unknown;
  sortable?: boolean;
  filter?: boolean;
}

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent {
  @Input() public columnDefs: ColumnDefs[];

  @Input() public rowData: RowData[];

  @Input() public domLayout: 'normal' | 'autoHeight' = 'autoHeight';
}
