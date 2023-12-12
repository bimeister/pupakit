import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableBodyBaseRowRef } from '../interfaces/table-body-row-ref.interface';

export interface TableBodyRowOptions<T> {
  id: string;
  index: number;
  data: T;
  selectedIds$: Observable<Set<string>>;
}

export class TableBodyRow<T> extends TableRow implements TableBodyBaseRowRef<T> {
  public readonly data: T;
  public readonly selectedIds$: Observable<Set<string>>;
  public readonly isSelected$: Observable<boolean>;

  constructor({ id, index, ...rest }: TableBodyRowOptions<T>) {
    super(id, index);
    Object.assign(this, rest);
    this.isSelected$ = this.selectedIds$.pipe(map((selectedIds: Set<string>) => selectedIds.has(this.id)));
  }
}
