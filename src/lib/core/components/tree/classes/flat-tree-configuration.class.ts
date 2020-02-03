import { ListRange } from '@angular/cdk/collections';
import { TemplateRef, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';

import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { FlatTreeItem } from './flat-tree-item.class';
import { TreeConfiguration } from './tree-configuration.class';

export class FlatTreeConfiguration extends TreeConfiguration {
  public readonly dataSource: FlatTreeDataSource = new FlatTreeDataSource(this.dataOrigin$, this.expandedItemsIds$);

  constructor(
    public readonly dataOrigin$: Observable<FlatTreeItem[]>,
    public readonly nodeTemplate: TemplateRef<any> = null,
    public readonly trackBy: TrackByFunction<FlatTreeItem> = null
  ) {
    super(dataOrigin$, nodeTemplate, trackBy);
  }

  public updateVisibleRange(range: ListRange): void {
    this.dataSource.setRange(range);
  }
}
