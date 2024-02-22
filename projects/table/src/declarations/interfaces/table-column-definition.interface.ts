import { TableColumnPin } from '../enums/table-column-pin.enum';
import { TableAdaptiveColumnSizes } from './table-adaptive-column-sizes.interface';
import { TableColumnSizes } from './table-column-sizes.interface';

export interface TableColumnDefinition<TFeatureOptions = unknown, TModel = unknown, SType = never> {
  id: TModel extends object ? keyof TModel | SType : string;
  modelKey?: TModel extends object ? keyof TModel : string;
  title?: string;
  pin?: TableColumnPin;
  type?: TModel extends object ? keyof TModel | 'default' : string;
  draggable?: boolean;
  sortable?: boolean;
  isSortingNoneAvailable?: boolean;
  resizable?: boolean;
  rerenderOnRowOrColumnChanges?: boolean;
  defaultSizes?: TableColumnSizes;
  adaptiveSizes?: TableAdaptiveColumnSizes;
  featureOptions?: TFeatureOptions;
}
