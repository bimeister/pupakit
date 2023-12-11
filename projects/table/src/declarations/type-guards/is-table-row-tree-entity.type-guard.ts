import { isNil } from '@bimeister/utilities';
import { TableBodyTreeNodeRowRef, TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';

export function isTableRowTreeEntity<T>(value: TableBodyRowRef<T>): value is TableBodyTreeNodeRowRef<T> {
  if (isNil(value)) {
    return false;
  }

  const typedValue: TableBodyTreeNodeRowRef<T> = value as TableBodyTreeNodeRowRef<T>;

  const hasAllFields: boolean =
    typedValue.isExtendable !== undefined || typedValue.isExtended !== undefined || typedValue.parentId !== undefined;

  return hasAllFields;
}
