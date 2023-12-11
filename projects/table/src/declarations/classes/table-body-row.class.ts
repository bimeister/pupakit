import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableBodyBaseRowRef } from '../interfaces/table-body-row-ref.interface';

export class TableBodyRow<T> extends TableRow implements TableBodyBaseRowRef<T> {
  public readonly isSelected$: Observable<boolean> = this.selectedIds$.pipe(
    map((selectedIds: Set<string>) => selectedIds.has(this.id))
  );

  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    private readonly selectedIds$: Observable<Set<string>>
  ) {
    super();
  }
}
