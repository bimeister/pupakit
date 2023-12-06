import { ListRange } from '@angular/cdk/collections';
import { BusEventBase } from '@bimeister/pupakit.common';
import { getUuid, Nullable } from '@bimeister/utilities';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableEventTargetCellData } from '../interfaces/table-event-target-cell-data.interface';

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
    constructor(public readonly targetCell: Nullable<TableEventTargetCellData>) {
      super();
    }
  }

  export class MouseOver extends TableEventBase {
    constructor(public readonly targetCell: Nullable<TableEventTargetCellData>) {
      super();
    }
  }

  export class PanStart extends TableEventBase {
    constructor(
      public readonly targetCell: Nullable<TableEventTargetCellData>,
      public readonly triggeredByResizer: boolean,
      public readonly pointerType: string
    ) {
      super();
    }
  }
  export class Pan extends TableEventBase {
    constructor(
      public readonly targetCell: Nullable<TableEventTargetCellData>,
      public readonly panDelta: [number, number],
      public readonly globalPosition: [number, number]
    ) {
      super();
    }
  }
  export class PanEnd extends TableEventBase {
    constructor(public readonly targetCell: Nullable<TableEventTargetCellData>) {
      super();
    }
  }

  export class ColumnDragStart extends TableEventBase {
    constructor(public readonly columnId: string) {
      super();
    }
  }
  export class ColumnDragIndicatorPositionChange extends TableEventBase {
    constructor(public readonly offsetLeft: Nullable<number>) {
      super();
    }
  }
  export class ColumnDragEnd extends TableEventBase {
    constructor(public readonly columnId: string, public readonly newIndex: number, public readonly oldIndex: number) {
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
  export class SetColumnDefinitions<TFeatureOptions = unknown, TModel = unknown> extends TableEventBase {
    constructor(public readonly definitions: TableColumnDefinition<TFeatureOptions, TModel>[]) {
      super();
    }
  }
  export class FitColumns extends TableEventBase {}
  export class StartFitColumnsOnResize extends TableEventBase {}
  export class StopFitColumnsOnResize extends TableEventBase {}
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
  export class ScrollByIndex extends TableEventBase {
    constructor(public readonly index: number) {
      super();
    }
  }
  export class RefreshDataSlice extends TableEventBase {}
}
