import { TableBodyTreeBranchRowRef, TableBodyTreeLeafRowRef } from '../interfaces/table-body-row-ref.interface';
import { TableBodyRow, TableBodyRowOptions } from './table-body-row.class';

export interface TableBodyTreeLeafRowOptions<T> extends TableBodyRowOptions<T> {
  parentId: string;
  level: number;
}
export interface TableBodyTreeBranchRowOptions<T> extends TableBodyTreeLeafRowOptions<T> {
  isExpandable: boolean;
  isExpanded: boolean;
}

export class TableBodyTreeBranchRow<T> extends TableBodyRow<T> implements TableBodyTreeBranchRowRef<T> {
  public readonly parentId: string;
  public readonly level: number;
  public readonly isExpandable: boolean;
  public readonly isExpanded: boolean;
  constructor({ id, index, data, selectedIds$, ...rest }: TableBodyTreeBranchRowOptions<T>) {
    super({ id, index, data, selectedIds$ });
    Object.assign(this, rest);
  }
}

export class TableBodyTreeLeafRow<T> extends TableBodyRow<T> implements TableBodyTreeLeafRowRef<T> {
  public readonly parentId: string;
  public readonly level: number;
  public readonly isExpandable: false = false;
  public readonly isExpanded: false = false;
  constructor({ id, index, data, selectedIds$, ...rest }: TableBodyTreeLeafRowOptions<T>) {
    super({ id, index, data, selectedIds$ });
    Object.assign(this, rest);
  }
}
