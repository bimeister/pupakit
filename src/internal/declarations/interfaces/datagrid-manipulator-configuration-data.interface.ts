import { GetRowNodeIdFunc, GridOptions, IDatasource } from 'ag-grid-community';

import { DatagridDomLayouts } from '../enums/datagrid-dom-layouts.enum';
import { DatagridThemes } from '../enums/datagrid-themes.enum';

export interface DatagridManipulatorConfigurationData {
  showColumnSettings: boolean;
  initialRowDataSource: IDatasource;
  sizeColumnsToFit: boolean;
  rowsAutoheight: boolean;
  theme: DatagridThemes;
  domLayout: DatagridDomLayouts;
  gridOptions: GridOptions;
  rowTrackByFn: GetRowNodeIdFunc;
}
