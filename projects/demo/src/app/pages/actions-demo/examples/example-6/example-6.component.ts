import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const ITEM_COUNT: number = 11;

interface Action {
  name: string;
  action: (iterator: number) => void;
}

@Component({
  selector: 'demo-actions-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample6Component {
  public readonly actions: Action[] = [];

  constructor() {
    for (let i: number = 1; i < ITEM_COUNT; i++) {
      this.actions.push({
        name: `Action ${i}`,
        action() {
          // eslint-disable-next-line no-console
          console.log(`Click button №${i}`);
        },
      });
    }
  }
}
