import { TreeManipulatorNewDataOrigin } from '../interfaces/tree-manipulator-new-data-origin.interface';
import { TreeManipulatorBase } from './abstract/tree-manipulator-base.abstract';

export class TreeManipulatorNew extends TreeManipulatorBase {
  constructor(dataOrigin: TreeManipulatorNewDataOrigin) {
    super(dataOrigin);
  }
}
