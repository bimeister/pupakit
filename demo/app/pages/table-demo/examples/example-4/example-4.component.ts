import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TableController } from '../../../../../../src/internal/declarations/classes/table-controller.class';
import { Uuid } from '../../../../../../src/internal/declarations/types/uuid.type';
import { TableColumnDefenition } from '../../../../../../src/internal/declarations/interfaces/table-column-defenition.interface';
import { TableColumnPin } from '../../../../../../src/internal/declarations/enums/table-column-pin.enum';
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
  age: index + 1
}));

const COLUMNS: TableColumnDefenition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },

    // use type for template
    type: 'name'
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },

    // use type for template
    type: 'name'
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },

    // use type for template
    type: 'city'
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },

    // use type for template
    type: 'age'
  }
];

@Component({
  selector: 'demo-table-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableExample4Component {
  public readonly rowType: SomeData;

  public readonly controller: TableController<SomeData> = new TableController<SomeData>();

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    this.controller.setData(DATA);
  }
}
