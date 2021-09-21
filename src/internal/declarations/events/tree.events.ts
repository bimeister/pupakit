import { getUuid, Nullable } from '@bimeister/utilities';
import { FlatTreeItem } from '../classes/flat-tree-item.class';
import { BusEventBase } from '@bimeister/event-bus';
import { DropEventInterface } from '../interfaces/drop-event.interface';

interface SetChildrenEventPayload {
  treeItemId: Nullable<string>;
  children: FlatTreeItem[];
}

export namespace TreeEvents {
  export class TreeEventBase<T = unknown> extends BusEventBase<T> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;

    constructor(public readonly payload: T = null, public readonly fromId: Nullable<string> = null) {
      super();
    }
  }

  export class Click extends TreeEventBase<FlatTreeItem> {}
  export class RemoveItem extends TreeEventBase<string> {}
  export class UpdateItem extends TreeEventBase<FlatTreeItem> {}
  export class ScrollById extends TreeEventBase<string> {}
  export class Drop extends TreeEventBase<DropEventInterface<FlatTreeItem>> {}
  export class ScrollByIndex extends TreeEventBase<number> {}
  export class ScrollViewport extends TreeEventBase<number> {}
  export class SetData extends TreeEventBase<FlatTreeItem[]> {}
  export class SetLoading extends TreeEventBase<boolean> {}
  export class SetSelected extends TreeEventBase<string[]> {}
  export class Collapse extends TreeEventBase<string> {}
  export class Expand extends TreeEventBase<string> {}
  export class ExpandWhileDragging extends TreeEventBase<string> {}
  export class RemoveChildren extends TreeEventBase<string> {}
  export class SetExpanded extends TreeEventBase<string[]> {}
  export class SetChildren extends TreeEventBase<SetChildrenEventPayload> {}
}
