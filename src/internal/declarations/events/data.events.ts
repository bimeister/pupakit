import { DropEventInterface } from '../interfaces/drop-event.interface';
import { DataEventBase } from '../classes/data-event-base.class';

export namespace DataEvents {
  export class Click<T> extends DataEventBase<T> {}
  export class RemoveItem extends DataEventBase<string> {}
  export class UpdateItem<T> extends DataEventBase<T> {}
  export class ScrollById extends DataEventBase<string> {}
  export class Drop<T> extends DataEventBase<DropEventInterface<T>> {}

  export class ScrollByIndex extends DataEventBase<number> {}
  export class ScrollViewport extends DataEventBase<number> {}
  export class SetData<T> extends DataEventBase<T[]> {}
  export class SetLoading extends DataEventBase<boolean> {}
  export class SetSelected extends DataEventBase<string[]> {}
}
