import { BusEventBase } from '@bimeister/pupakit.common';
import { getUuid, Nullable } from '@bimeister/utilities';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export namespace TableColumnEvents {
  export class TableColumnEventBase extends BusEventBase<unknown> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;
    public readonly payload: unknown = null;

    constructor(public readonly fromId: Nullable<string> = null) {
      super();
    }
  }

  export class HoverChanged extends TableColumnEventBase {
    constructor(public readonly isHovered: boolean) {
      super();
    }
  }

  export class CurrentResizableChanged extends TableColumnEventBase {
    constructor(public readonly isCurrentResizable: boolean) {
      super();
    }
  }

  export class WidthChanged extends TableColumnEventBase {
    constructor(public readonly widthPx: number) {
      super();
    }
  }

  export class GetCurrentWidth extends TableColumnEventBase {
    constructor() {
      super();
    }
  }

  export class CurrentWidthResponse extends TableColumnEventBase {
    constructor(public readonly fromId: string, public readonly widthPx: number) {
      super();
    }
  }

  export class CurrentDraggableChanged extends TableColumnEventBase {
    constructor(public readonly isCurrentDraggable: boolean) {
      super();
    }
  }

  export class CurrentDragTargetChanged extends TableColumnEventBase {
    constructor(public readonly isCurrentDragTarget: boolean) {
      super();
    }
  }

  export class SortingChanged extends TableColumnEventBase {
    constructor(public readonly sorting: TableColumnSorting) {
      super();
    }
  }

  export class GetCurrentSorting extends TableColumnEventBase {
    constructor() {
      super();
    }
  }

  export class CurrentSortingResponse extends TableColumnEventBase {
    constructor(public readonly fromId: string, public readonly sorting: TableColumnSorting) {
      super();
    }
  }
}
