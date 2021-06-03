import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';
import { TreeItemInterface } from './tree-item.interface';
import { TreeManipulatorCommonDataOrigin } from './tree-manipulator-common-data-origin.interface';

export interface TreeManipulatorHierarchicalDataOrigin extends TreeManipulatorCommonDataOrigin {
  readonly type: TreeType.Hierarchical;
  readonly treeNodesOrigin: Observable<TreeItemInterface[]>;
  readonly treeElementsOrigin: Observable<TreeItemInterface[]>;
  readonly hideRoot: Observable<boolean>;
}
