import { Observable } from 'rxjs';
import { TableRowRef } from './table-row-ref.interface';

export interface TableBodyRowRef<T> extends TableRowRef {
  readonly data: T;
  readonly isSelected$: Observable<boolean>;
  readonly isDisabled$: Observable<boolean>;
}
