import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const ITEM_COUNT: number = 11;

interface Action {
  name: string;
  action: (iterator: number) => void;
}

@Component({
  selector: 'demo-actions-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample3Component {
  public readonly actions: Action[] = [];

  constructor() {
    for (let i: number = 1; i < ITEM_COUNT; i++) {
      this.actions.push({
        name: `Button ${i}`,
        action() {
          // eslint-disable-next-line no-console
          console.log(`Click button №${i}`);
        },
      });
    }
  }
}
