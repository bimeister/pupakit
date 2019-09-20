import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChipItem } from './../../../src/lib/core/components/chip-select/chip-select.component';

@Component({
  selector: 'demo-chip-select',
  styleUrls: ['../demo.scss'],
  templateUrl: './chip-select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipSelectDemoComponent {
  public selectItems: ChipItem[] = [
    {
      key: 'key_1',
      value: 'Item 1',
      icon: 'pizza'
    },
    {
      key: 'key_2',
      value: 'Item 2',
      icon: 'person-add'
    },
    {
      key: 'key_3',
      value: 'Item 3',
      icon: 'man'
    },
    {
      key: 'key_3_1',
      value: 'Item 3.1',
      icon: 'add'
    },
    {
      key: 'key_3_2',
      value: 'Item 3.2',
      icon: 'add'
    },
    {
      key: 'key_3_3',
      value: 'Item 3.3',
      icon: 'add'
    },
    {
      key: 'key_4',
      value: 'Item 4',
      icon: 'add'
    }
  ];
  public items: ChipItem[] = [
    {
      key: 'key_1',
      value: 'Item 1 Item 1 Item 1 Item 1',
      icon: 'pizza'
    },
    {
      key: 'key_2',
      value: 'Item 2',
      icon: 'person-add'
    },
    {
      key: 'key_3',
      value: 'Item 3',
      icon: 'man',
      clickable: false,
      children: [
        {
          key: 'key_3_11',
          value: 'Item 11',
          icon: 'person-add'
        },
        {
          key: 'key_3_22',
          value: 'Item 222',
          icon: 'person-add'
        },
        {
          key: 'key_3_33',
          value: 'Item 333',
          icon: 'person-add'
        }
      ]
    },
    {
      key: 'key_3_1',
      value: 'Item 3.1',
      icon: 'add'
    },
    {
      key: 'key_3_2',
      value: 'Item 3.2',
      icon: 'add'
    },
    {
      key: 'key_3_3',
      value: 'Item 3.3',
      icon: 'add'
    },
    {
      key: 'key_3_4',
      value: 'Item 3.4',
      icon: 'add'
    },
    {
      key: 'key_3_5',
      value: 'Item 3.5',
      icon: 'add'
    },
    {
      key: 'key_4',
      value: 'Item 4',
      icon: 'add'
    }
  ];

  public addedItem(item: ChipItem): void {
    // tslint:disable-next-line: no-console
    console.log(item);
  }

  public removedItem(item: ChipItem): void {
    // tslint:disable-next-line: no-console
    console.log(item);
  }
}
