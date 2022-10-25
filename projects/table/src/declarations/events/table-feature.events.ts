import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { TableEvents } from './table.events';

export namespace TableFeatureEvents {
  export class TableFeatureEventBase extends TableEvents.TableEventBase {}

  export class ColumnSortingChanged extends TableFeatureEventBase {
    constructor(public readonly sorting: TableColumnSorting, public readonly columnId: string) {
      super();
    }
  }

  export class ToggleColumnSorting extends TableFeatureEventBase {
    constructor(public columnId: string) {
      super();
    }
  }

  export class SetColumnSorting extends TableFeatureEventBase {
    constructor(public columnId: string, public readonly sorting: TableColumnSorting) {
      super();
    }
  }
}
