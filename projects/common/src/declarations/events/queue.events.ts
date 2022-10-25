import { getUuid, Nullable } from '@bimeister/utilities';
import { BusEventBase } from '../classes/abstract/bus-event-base.abstract';

class QueueEventBase<T> extends BusEventBase<T> {
  public readonly scope: Nullable<string> = null;
  public readonly id: string = getUuid();
  public readonly type: Nullable<string> = null;
  public readonly fromId: Nullable<string> = null;

  constructor(public readonly payload: T) {
    super();
  }
}

export namespace QueueEvents {
  export class AddToQueue extends QueueEventBase<BusEventBase> {}
  export class RemoveFromQueue extends QueueEventBase<string> {}
  export class StartQueue extends QueueEventBase<void> {}
}
