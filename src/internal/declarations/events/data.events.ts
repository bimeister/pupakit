import { DropEventInterface } from '../interfaces/drop-event.interface';
import { DataEventBase } from '../classes/data-event-base.class';
import { FlatTreeItem } from '../classes/flat-tree-item.class';

export namespace DataEvents {
  export class Click extends DataEventBase<FlatTreeItem> {}
  export class RemoveItem extends DataEventBase<string> {}
  export class UpdateItem extends DataEventBase<FlatTreeItem> {}
  export class ScrollById extends DataEventBase<string> {}
  export class Drop extends DataEventBase<DropEventInterface<FlatTreeItem>> {}

  export class ScrollByIndex extends DataEventBase<number> {}
  export class SetData extends DataEventBase<FlatTreeItem[]> {}
  export class SetLoading extends DataEventBase<boolean> {}
  export class SetSelected extends DataEventBase<string[]> {}
}
