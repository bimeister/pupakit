import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';
import { FlatTreeItemInterface } from './flat-tree-item.interface';

export interface TreeManipulatorFlatDataOrigin {
  readonly type: TreeType.Flat;
  readonly flatDataOrigin: Observable<FlatTreeItemInterface[]>;
  readonly hideRoot: boolean;
}
