import { Nullable } from '@bimeister/utilities';
import { DataEventBase } from '../data-event-base.class';
import { FlatTreeItem } from '../flat-tree-item.class';

interface SetChildrenEventPayload {
  treeItemId: Nullable<string>;
  children: FlatTreeItem[];
}

export namespace TreeEvent {
  export class Collapse extends DataEventBase<string> {}
  export class Expand extends DataEventBase<string> {}
  export class RemoveChildren extends DataEventBase<string> {}
  export class SetExpanded extends DataEventBase<string[]> {}
  export class SetChildren extends DataEventBase<SetChildrenEventPayload> {}
}
