import { SortModel } from './sort-model.interface';
import { ColumnState } from 'ag-grid-community';

export interface GridState {
  sortModel: SortModel[];
  columnState: ColumnState[];
}
