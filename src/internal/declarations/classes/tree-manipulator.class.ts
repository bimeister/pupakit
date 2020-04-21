import { TreeManipulatorConfiguration } from '../interfaces/tree-manipulator-configuration.interface';

export abstract class TreeManipulator {
  constructor(protected readonly configuration: TreeManipulatorConfiguration) {}
}
