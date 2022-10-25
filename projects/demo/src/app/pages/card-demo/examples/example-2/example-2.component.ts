import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CardSize } from '@bimeister/pupakit.kit';

interface Case {
  title: string;
  description: string;
  size: CardSize;
  disabled: boolean;
  clickable: boolean;
}

@Component({
  selector: 'demo-card-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDemoExample2Component {
  public readonly mediumCards: Partial<Case>[] = [
    {
      title: 'Basic medium card',
      description: 'Also a basic card, but smaller :3',
    },
    {
      title: 'Medium disabled',
      description: 'A medium card in disabled state',
      disabled: true,
    },
    {
      title: 'Medium clickable',
      description: 'A medium card that you can click on',
      clickable: true,
    },
    {
      title:
        'A medium card with a very long header that can take up two lines, and in case of overflow will be hidden behind a colon',
      description: 'The description can also be very long and hidden behind a colon',
    },
  ];
}
