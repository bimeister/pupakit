import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';

export class TableBodyRow<T> extends TableRow implements TableBodyRowRef<T> {
  public readonly isSelected$: Observable<boolean> = this.selectedIds$.pipe(
    map((selectedIds: Set<string>) => selectedIds.has(this.id))
  );

  constructor(
    public readonly id: string,
    public readonly data: T,
    private readonly selectedIds$: Observable<Set<string>>
  ) {
    super();
  }
}
