import { BusEventBase } from '@bimeister/event-bus';
import { getUuid, Nullable } from '@bimeister/utilities';

export class DataEventBase<T = unknown> extends BusEventBase<T> {
  public readonly scope: Nullable<string> = null;
  public readonly id: string = getUuid();
  public readonly type: Nullable<string> = null;

  constructor(public readonly payload: T = null, public readonly fromId: Nullable<string> = null) {
    super();
  }
}
