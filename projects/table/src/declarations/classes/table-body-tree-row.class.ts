import { Observable } from 'rxjs';
import { TableBodyTreeBranchRowRef, TableBodyTreeLeafRowRef } from '../interfaces/table-body-row-ref.interface';
import { TableBodyRow } from './table-body-row.class';

export class TableBodyTreeNodeRow<T> extends TableBodyRow<T> implements TableBodyTreeBranchRowRef<T> {
  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    selectedIds$: Observable<Set<string>>,
    public readonly parentId: string,
    public readonly isExtendable: boolean,
    public readonly isExtended: boolean,
    public readonly level: number
  ) {
    super(id, index, data, selectedIds$);
  }
}

export class TableBodyTreeLeafRow<T> extends TableBodyRow<T> implements TableBodyTreeLeafRowRef<T> {
  public readonly isExtendable: false = false;
  public readonly isExtended: false = false;
  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    selectedIds$: Observable<Set<string>>,
    public readonly parentId: string,
    public readonly level: number
  ) {
    super(id, index, data, selectedIds$);
  }
}
