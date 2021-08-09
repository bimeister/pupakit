import { getUuid } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { TableRowRef } from '../interfaces/table-row-ref.interface';

export class TableRow implements TableRowRef {
  public readonly id: string = getUuid();
  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
