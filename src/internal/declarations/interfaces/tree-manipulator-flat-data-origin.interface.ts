import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';
import { FlatTreeItemInterface } from './flat-tree-item.interface';
import { TreeManipulatorCommonDataOrigin } from './tree-manipulator-common-data-origin.interface';

export interface TreeManipulatorFlatDataOrigin extends TreeManipulatorCommonDataOrigin {
  readonly type: TreeType.Flat;
  readonly flatDataOrigin: Observable<FlatTreeItemInterface[]>;
  readonly hideRoot: Observable<boolean>;
}
