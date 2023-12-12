import { Observable } from 'rxjs';
import { TableRowRef } from './table-row-ref.interface';

export interface TableBodyBaseRowRef<T> extends TableRowRef {
  readonly data: T;
  readonly isSelected$: Observable<boolean>;
}
export interface TableBodyTreeBranchRowRef<T> extends TableBodyBaseRowRef<T> {
  readonly isExpandable: boolean;
  readonly isExpanded: boolean;
  readonly parentId: string;
  readonly level: number;
}
export interface TableBodyTreeLeafRowRef<T> extends TableBodyTreeBranchRowRef<T> {
  readonly isExpandable: false;
  readonly isExpanded: false;
}

export type TableBodyTreeNodeRowRef<T> = TableBodyTreeBranchRowRef<T> | TableBodyTreeLeafRowRef<T>;

export type TableBodyRowRef<T> = TableBodyBaseRowRef<T> | TableBodyTreeNodeRowRef<T>;
