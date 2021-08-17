import { Nullable } from '@bimeister/utilities';
import { DataEventBase } from '../classes/data-event-base.class';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

interface SetChildrenEventPayload {
  treeItemId: Nullable<string>;
  children: FlatTreeItem[];
}

export namespace TreeEvents {
  export class Collapse extends DataEventBase<string> {}
  export class Expand extends DataEventBase<string> {}
  export class RemoveChildren extends DataEventBase<string> {}
  export class SetExpanded extends DataEventBase<string[]> {}
  export class SetChildren extends DataEventBase<SetChildrenEventPayload> {}
}
