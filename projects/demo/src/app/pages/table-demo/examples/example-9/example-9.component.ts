import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import { TableColumnDefinition, TableController } from '@bimeister/pupakit.table';
import { getUuid } from '@bimeister/utilities';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
}

const DATA: SomeData[] = Array.from({ length: 200 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  age: index + 1,
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    defaultSizes: { widthPx: 200 },
    type: 'first-name',
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',

    // Don't set defaultSizes property for auto width calculation
    // defaultSizes: { ... }
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',

    // You may disable auto width calculation for specific breakpoint
    adaptiveSizes: {
      md: { widthPx: 100 },
    },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    defaultSizes: { widthPx: 100 },
  },
];

@Component({
  selector: 'demo-table-example-9',
  templateUrl: './example-9.component.html',
  styleUrls: ['./example-9.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample9Component {
  public readonly rowType: SomeData;

  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.startFitColumnsOnResize();
    this.controller.setData(DATA);
  }
}
