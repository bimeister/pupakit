import { isNil } from '@bimeister/utilities';
import { TableTreeDefinition } from '../interfaces/table-tree-definition.interface';

export function hasTreeDefinition(value: unknown): value is TableTreeDefinition {
  if (isNil(value)) {
    return false;
  }

  const typedValue: TableTreeDefinition = value as TableTreeDefinition;
  const hasFields: boolean =
    typedValue.modelExpandableKey !== undefined &&
    typedValue.modelExpandedKey !== undefined &&
    typedValue.modelIdKey !== undefined &&
    typedValue.modelParentIdKey !== undefined &&
    typedValue.modelLevelKey !== undefined;

  return hasFields;
}
