import { Observable } from 'rxjs';
import { TableRowRef } from './table-row-ref.interface';
import { TableTreeDefinition } from './table-tree-definition.interface';

export interface TableBodyRowRef<T> extends TableRowRef {
  readonly data: T;
  readonly isSelected$: Observable<boolean>;
  readonly treeDefinition?: TableTreeDefinition;
}
