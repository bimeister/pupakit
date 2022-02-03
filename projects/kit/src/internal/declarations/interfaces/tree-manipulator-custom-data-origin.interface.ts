import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';
import { TreeManipulatorCommonDataOrigin } from './tree-manipulator-common-data-origin.interface';

export interface TreeManipulatorCustomDataOrigin extends TreeManipulatorCommonDataOrigin {
  readonly type: TreeType.Custom;
  readonly hideRoot: Observable<boolean>;
}
