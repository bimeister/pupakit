import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableColumnSizes } from './table-column-sizes.interface';
import { TableAdaptiveColumnSizes } from './table-adaptive-column-sizes.interface';

export interface TableColumnDefinition {
  id: string;
  modelKey?: string;
  title?: string;
  pin?: TableColumnPin;
  type?: string;
  draggable?: boolean;
  sortable?: boolean;
  isSortingNoneAvailable?: boolean;
  resizable?: boolean;
  rerenderOnRowOrColumnChanges?: boolean;
  defaultSizes?: TableColumnSizes;
  adaptiveSizes?: TableAdaptiveColumnSizes;
}
