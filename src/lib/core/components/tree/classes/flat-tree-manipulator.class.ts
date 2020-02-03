import { ListRange } from '@angular/cdk/collections';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';

import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeManipulator } from './tree-manipulator.class';

export class FlatTreeManipulator extends TreeManipulator {
  public readonly dataSource: FlatTreeDataSource = new FlatTreeDataSource(this.dataOrigin$, this.expandedItemsIds$);

  constructor(
    public readonly dataOrigin$: Observable<FlatTreeItem[]>,
    public readonly selectedNodesIds$: Observable<string[]>,
    public readonly scrollByRoute$: Observable<string[]>,
    public readonly nodeTemplate: TemplateRef<any> = null,
    public readonly trackBy: TrackByFunction<FlatTreeItem> = null
  ) {
    super(dataOrigin$, selectedNodesIds$, scrollByRoute$, nodeTemplate, trackBy);
  }

  public updateVisibleRange(range: ListRange): void {
    this.dataSource.setRange(range);
  }
}
