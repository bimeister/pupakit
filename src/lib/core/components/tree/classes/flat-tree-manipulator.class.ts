import { ListRange } from '@angular/cdk/collections';

import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { TreeManipulator, TreeManipulatorConfiguration } from './tree-manipulator.class';

export class FlatTreeManipulator extends TreeManipulator {
  public readonly dataSource: FlatTreeDataSource = new FlatTreeDataSource(this.dataOrigin$, this.expandedItemsIds$);

  constructor(protected readonly configuration: TreeManipulatorConfiguration) {
    super(configuration);
  }

  public updateVisibleRange(range: ListRange): void {
    this.dataSource.setRange(range);
  }
}
