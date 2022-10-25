import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ACTIONS_DEFAULT_MORE_BUTTON_TRIGGER_TEXT_TOKEN } from '@bimeister/pupakit.widgets';

const ITEM_COUNT: number = 25;

interface Action {
  name: string;
  action: (iterator: number) => void;
}

@Component({
  selector: 'demo-actions-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ACTIONS_DEFAULT_MORE_BUTTON_TRIGGER_TEXT_TOKEN,
      useValue: 'More actions',
    },
  ],
})
export class ActionsExample5Component {
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
