import { isNil } from '@bimeister/utilities';
import { TableColumnSortingOptions } from '../../declarations/interfaces/table-column-sorting-options.interface';

export function isTableColumnSortingOptions(value: unknown): value is TableColumnSortingOptions {
  if (isNil(value)) {
    return false;
  }

  const typedValue: TableColumnSortingOptions = value as TableColumnSortingOptions;

  const hasOneOfFields: boolean =
    typedValue.sortable !== undefined ||
    typedValue.isSortingNoneAvailable !== undefined ||
    typedValue.defaultState !== undefined;

  return hasOneOfFields;
}
