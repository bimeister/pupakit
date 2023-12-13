import { TableTreeExpanderElement } from '../interfaces/table-tree-expander.interface';

export function isTreeExpander(value: HTMLElement): value is TableTreeExpanderElement {
  if (!(value instanceof HTMLElement)) {
    return false;
  }

  const typedValue: TableTreeExpanderElement = value as TableTreeExpanderElement;
  const hasDataValue: boolean = typedValue.dataset.treeExpander === 'true';
  return hasDataValue;
}
