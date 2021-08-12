import { Observable } from 'rxjs';
import { DataDisplayCollectionRef } from './data-display-collection-ref.interface';

export interface TreeDataDisplayCollectionRef extends DataDisplayCollectionRef {
  readonly expandedIdsList$: Observable<string[]>;

  setExpandedIdsList(value: string[]): void;
}
