import { BusEventBase } from '@bimeister/pupakit.common';
import { getUuid, Nullable } from '@bimeister/utilities';

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
  export class ExpandChanged extends TableRowEventBase {
    constructor(public readonly isExpanded: boolean) {
      super();
    }
  }
}
