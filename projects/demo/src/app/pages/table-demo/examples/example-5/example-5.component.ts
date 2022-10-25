import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Uuid } from '@bimeister/pupakit.common';
import { TableColumnDefinition, TableColumnPin, TableController } from '@bimeister/pupakit.table';
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
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 210 },
    adaptiveSizes: {
      lg: { widthPx: 170 },
      md: { widthPx: 140 },
      sm: { widthPx: 100 },
    },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 180 },
    adaptiveSizes: {
      lg: { widthPx: 150 },
      md: { widthPx: 100 },
      sm: { widthPx: 90 },
    },
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
    adaptiveSizes: {
      lg: { widthPx: 160 },
      md: { widthPx: 130 },
      sm: { widthPx: 100 },
    },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
    adaptiveSizes: {
      lg: { widthPx: 90 },
      md: { widthPx: 80 },
      sm: { widthPx: 60 },
    },
  },
];

@Component({
  selector: 'demo-table-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample5Component {
  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);
  }
}
