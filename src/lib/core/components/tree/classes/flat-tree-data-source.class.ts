import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { FlatTreeItem } from './flat-tree-item.class';

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  constructor(private readonly sortedData$: Observable<FlatTreeItem[]>) {
    super();
  }

  public connect(_collectionViewer: CollectionViewer): Observable<FlatTreeItem[]> {
    return this.sortedData$;
  }
  public disconnect(_collectionViewer: CollectionViewer): void {
    return;
  }
}
