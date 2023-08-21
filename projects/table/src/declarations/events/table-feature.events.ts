import { TableSort } from '../interfaces/table-sort.interface';
import { TableEvents } from './table.events';

export namespace TableFeatureEvents {
  export class TableFeatureEventBase extends TableEvents.TableEventBase {}

  export class ColumnSortingChanged<T extends string = string> extends TableFeatureEventBase {
    constructor(public readonly tableSort: TableSort<T>) {
      super();
    }
  }

  export class ToggleColumnSorting<T extends string = string> extends TableFeatureEventBase {
    constructor(public columnId: T) {
      super();
    }
  }

  export class SetColumnSorting<T extends string = string> extends TableFeatureEventBase {
    constructor(public readonly tableSort: TableSort<T>) {
      super();
    }
  }
}
