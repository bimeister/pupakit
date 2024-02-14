import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';

export class TableBodyRow<T> extends TableRow implements TableBodyRowRef<T> {
  public readonly isSelected$: Observable<boolean> = this.selectedRowsIds$.pipe(
    map((selectedRowsIds: Set<string>) => selectedRowsIds.has(this.id)),
    distinctUntilChanged()
  );

  public readonly isDisabled$: Observable<boolean> = this.disabledRowsIds$.pipe(
    map((disabledRowsIds: Set<string>) => disabledRowsIds.has(this.id)),
    distinctUntilChanged()
  );

  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    private readonly selectedRowsIds$: Observable<Set<string>>,
    private readonly disabledRowsIds$: Observable<Set<string>>
  ) {
    super();
  }
}
