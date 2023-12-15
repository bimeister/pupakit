import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';

export interface TableBodyRowOptions<T> {
  id: string;
  index: number;
  data: T;
  selectedIds$: Observable<Set<string>>;
}

export class TableBodyRow<T> extends TableRow implements TableBodyRowRef<T> {
  public readonly isSelected$: Observable<boolean> = this.selectedIds$.pipe(
    map((selectedIds: Set<string>) => selectedIds.has(this.id))
  );
  public readonly isLoading$: Observable<boolean> = this.loadingIds$.pipe(
    map((loadingIds: Set<string>) => loadingIds.has(this.id))
  );

  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    private readonly selectedIds$: Observable<Set<string>>,
    private readonly loadingIds$: Observable<Set<string>>
  ) {
    super();
  }
}
