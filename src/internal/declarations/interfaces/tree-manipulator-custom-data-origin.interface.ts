import { Observable } from 'rxjs';

import { TreeType } from '../enums/tree-type.enum';

export interface TreeManipulatorCustomDataOrigin {
  readonly type: TreeType.Custom;
  readonly hideRoot: Observable<boolean>;
}
