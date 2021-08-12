import { BehaviorSubject } from 'rxjs';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { DataDisplayCollection } from './data-display-collection.class';

export class TreeDataDisplayCollection extends DataDisplayCollection implements TreeDataDisplayCollectionRef {
  public readonly expandedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public setExpandedIdsList(value: string[]): void {
    this.expandedIdsList$.next(value);
  }
}
