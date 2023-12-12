import { isNil } from '@bimeister/utilities';
import { TableBodyTreeNodeRowRef, TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';

export function isTableRowTreeEntity<T>(value: TableBodyRowRef<T>): value is TableBodyTreeNodeRowRef<T> {
  if (isNil(value)) {
    return false;
  }

  const typedValue: TableBodyTreeNodeRowRef<T> = value as TableBodyTreeNodeRowRef<T>;

  const hasAllFields: boolean =
    typedValue.isExpandable !== undefined ||
    typedValue.isExpanded !== undefined ||
    typedValue.parentId !== undefined ||
    typedValue.level !== undefined;

  return hasAllFields;
}
