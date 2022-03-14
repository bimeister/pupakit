import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

interface ExampleActions {
  name: string;
  count: number;
  description: string;
}

const NAMES: string[] = [
  'app-admin',
  'app-aim',
  'app-apps',
  'app-calendar',
  'app-card-view',
  'app-clipboard',
  'app-clock',
  'app-create',
  'app-doc',
  'app-cube',
];

const ITEM_COUNT: number = 10;

@Component({
  selector: 'demo-actions-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample2Component {
  public readonly actions: ExampleActions[] = [];

  constructor() {
    for (let i: number = 0; i < ITEM_COUNT; i++) {
      this.actions.push({
        name: NAMES[i],
        count: i,
        description: `${NAMES[i]} item`,
      });
    }
  }

  public getColor(count: number): string {
    return count % 2 === 0 ? '#08b87d' : '#ed6439';
  }
}
