import { DataEventBase } from '../classes/data-event-base.class';
import { TableColumnDefenition } from '../interfaces/table-column-defenition.interface';
import { ListRange } from '@angular/cdk/collections';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export namespace TableEvents {
  export class ColumnHover extends DataEventBase {
    constructor(public readonly columnId: string) {
      super();
    }
  }
  export class RowHover extends DataEventBase {
    constructor(public readonly rowId: string) {
      super();
    }
  }
  export class CellClick extends DataEventBase {
    constructor(public readonly columnId: string, public readonly rowId: string) {
      super();
    }
  }
  export class ColumnSortingChanged extends DataEventBase {
    constructor(public readonly sorting: TableColumnSorting, public readonly columnId: string) {
      super();
    }
  }
  export class ColumnWidthChanged extends DataEventBase {
    constructor(public readonly widthPx: number, public readonly columnId: string) {
      super();
    }
  }
  export class ListRangeChanged extends DataEventBase {
    constructor(public readonly listRange: ListRange) {
      super();
    }
  }
  export class HiddenColumnIdsChanged extends DataEventBase {
    constructor(public readonly leftColumnIds: string[], public readonly rightColumnIds: string[]) {
      super();
    }
  }
  export class HorizontalScrollBarVisibilityChanged extends DataEventBase {
    constructor(public readonly isVisible: boolean) {
      super();
    }
  }
  export class VerticalScrollBarVisibilityChanged extends DataEventBase {
    constructor(public readonly isVisible: boolean) {
      super();
    }
  }

  export class SetColumnDefinitions extends DataEventBase {
    constructor(public readonly definitions: TableColumnDefenition[]) {
      super();
    }
  }
  export class UpdateColumnWidthByDelta extends DataEventBase {
    constructor(public columnId: string, public readonly deltaPx: number) {
      super();
    }
  }
  export class SetColumnWidth extends DataEventBase {
    constructor(public columnId: string, public readonly widthPx: number) {
      super();
    }
  }
  export class ToggleColumnSorting extends DataEventBase {
    constructor(public columnId: string) {
      super();
    }
  }
  export class SetColumnSorting extends DataEventBase {
    constructor(public columnId: string, public readonly sorting: TableColumnSorting) {
      super();
    }
  }

  export class RefreshDataSlice extends DataEventBase {}
}
