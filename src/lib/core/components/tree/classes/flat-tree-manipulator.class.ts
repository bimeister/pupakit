import { FlatTreeDataSource } from './flat-tree-data-source.class';
import { TreeManipulator, TreeManipulatorConfiguration } from './tree-manipulator.class';

export class FlatTreeManipulator extends TreeManipulator {
  public readonly dataSource: FlatTreeDataSource = new FlatTreeDataSource(
    this.dataOrigin$,
    this.expandedItemsIds$,
    this.listRange$
  );

  constructor(protected readonly configuration: TreeManipulatorConfiguration) {
    super(configuration);
  }
}
