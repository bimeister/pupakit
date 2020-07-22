import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';
import { TreeItemInterface } from './tree-item.interface';

export interface TreeManipulatorHierarchicalDataOrigin {
  readonly type: TreeType.Hierarchical;
  readonly treeNodesOrigin: Observable<TreeItemInterface[]>;
  readonly treeElementsOrigin: Observable<TreeItemInterface[]>;
  readonly hideRoot: Observable<boolean>;
}
