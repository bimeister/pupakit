import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableColumnSizes } from './table-column-sizes.interface';
import { TableAdaptiveColumnSizes } from './table-adaptive-column-sizes.interface';

export interface TableColumnDefenition {
  id: string;
  modelKey: string;
  title: string;
  pin?: TableColumnPin;
  type?: string;
  rerenderOnRowOrColumnChanges?: boolean;
  defaultSizes?: TableColumnSizes;
  adaptiveSizes?: TableAdaptiveColumnSizes;
}
