import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableColumnDefinition, TableColumnPin, TableController } from '@bimeister/pupakit.table';
import { getUuid, Uuid } from '@bimeister/utilities';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
}

const DATA: SomeData[] = Array.from({ length: 3 }).map((_value: undefined, index: number) => ({
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
    defaultSizes: { widthPx: 200, maxWidthPx: 300, minWidthPx: 100 },
    // use type for template
    type: 'name',
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200, maxWidthPx: 300, minWidthPx: 100 },
    // use type for template
    type: 'name',
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
    // use type for template
    type: 'city',
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
    // use type for template
    type: 'age',
  },
];

@Component({
  selector: 'demo-example-1',
  templateUrl: 'example-1.component.html',
  styleUrls: ['example-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class Example1Component {
  public readonly searchControl: FormControl = new FormControl('');
  public readonly rowType: SomeData;
  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);
  }
}
