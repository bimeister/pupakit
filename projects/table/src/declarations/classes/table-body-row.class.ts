import { TableRow } from './table-row.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableBodyRowRef } from '../interfaces/table-body-row-ref.interface';
import { TableTreeDefinition } from '../interfaces/table-tree-definition.interface';


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
  public treeDefinition: TableTreeDefinition;

  constructor(
    public readonly id: string,
    public readonly index: number,
    public readonly data: T,
    private readonly selectedIds$: Observable<Set<string>>
  ) {
    super();
  }
}
