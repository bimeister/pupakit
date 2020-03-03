import { ColDef } from 'ag-grid-community';

export interface DatagridColDef extends ColDef {
  isAvailableInSettings: boolean;
}
