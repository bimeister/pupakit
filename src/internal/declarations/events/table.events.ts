import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { ListRange } from '@angular/cdk/collections';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { BusEventBase } from '@bimeister/event-bus';
import { getUuid, Nullable } from '@bimeister/utilities';
import { TableRowType } from '../enums/table-row-type.enum';

export namespace TableEvents {
  export class TableEventBase<T = unknown> extends BusEventBase<T> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;
    public readonly payload: T = null;

    constructor(public readonly fromId: Nullable<string> = null) {
      super();
    }
  }

  export class ColumnHover extends TableEventBase {
    constructor(public readonly columnId: string) {
      super();
    }
  }
  export class RowHover extends TableEventBase {
    constructor(public readonly rowId: string) {
      super();
    }
  }
  export class CellClick extends TableEventBase {
    constructor(
      public readonly columnId: string,
      public readonly rowId: string,
      public readonly rowType: TableRowType
    ) {
      super();
    }
  }
  export class ColumnSortingChanged extends TableEventBase {
    constructor(public readonly sorting: TableColumnSorting, public readonly columnId: string) {
      super();
    }
  }
  export class ColumnWidthChanged extends TableEventBase {
    constructor(public readonly widthPx: number, public readonly columnId: string) {
      super();
    }
  }
  export class ListRangeChanged extends TableEventBase {
    constructor(public readonly listRange: ListRange) {
      super();
    }
  }
  export class HiddenColumnIdsChanged extends TableEventBase {
    constructor(public readonly leftColumnIds: string[], public readonly rightColumnIds: string[]) {
      super();
    }
  }
  export class HorizontalScrollBarVisibilityChanged extends TableEventBase {
    constructor(public readonly isVisible: boolean) {
      super();
    }
  }
  export class VerticalScrollBarVisibilityChanged extends TableEventBase {
    constructor(public readonly isVisible: boolean) {
      super();
    }
  }

  export class SetData<T> extends TableEventBase {
    constructor(public readonly data: T[]) {
      super();
    }
  }
  export class SetSelected extends TableEventBase {
    constructor(public readonly selectedRowTrackByIds: string[]) {
      super();
    }
  }
  export class SetColumnDefinitions extends TableEventBase {
    constructor(public readonly definitions: TableColumnDefinition[]) {
      super();
    }
  }
  export class UpdateColumnWidthByDelta extends TableEventBase {
    constructor(public columnId: string, public readonly deltaPx: number) {
      super();
    }
  }
  export class SetColumnWidth extends TableEventBase {
    constructor(public columnId: string, public readonly widthPx: number) {
      super();
    }
  }
  export class ToggleColumnSorting extends TableEventBase {
    constructor(public columnId: string) {
      super();
    }
  }
  export class SetColumnSorting extends TableEventBase {
    constructor(public columnId: string, public readonly sorting: TableColumnSorting) {
      super();
    }
  }
  export class ScrollByIndex extends TableEventBase {
    constructor(public readonly index: number) {
      super();
    }
  }
  export class ScrollViewportByIndex extends TableEventBase {
    constructor(public readonly index: number) {
      super();
    }
  }
  export class RefreshDataSlice extends TableEventBase {}
}
