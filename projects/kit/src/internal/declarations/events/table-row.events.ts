import { getUuid, Nullable } from '@bimeister/utilities';
import { BusEventBase } from '../classes/abstract/bus-event-base.abstract';

export namespace TableRowEvents {
  export abstract class TableRowEventBase extends BusEventBase<unknown> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;
    public readonly payload: unknown = null;

    constructor(public readonly fromId: Nullable<string> = null) {
      super();
    }
  }

  export class HoverChanged extends TableRowEventBase {
    constructor(public readonly isHovered: boolean) {
      super();
    }
  }
}
