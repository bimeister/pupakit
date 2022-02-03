import { Observable } from 'rxjs';

export interface TableRowRef {
  readonly id: string;
  readonly isHovered$: Observable<boolean>;
}
