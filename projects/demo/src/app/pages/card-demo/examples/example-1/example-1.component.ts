import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CardSize, IconHolderSize } from '@bimeister/pupakit.kit';

interface Case {
  title: string;
  description: string;
  size: CardSize;
  disabled: boolean;
  clickable: boolean;
  iconHolderSize: IconHolderSize;
}

@Component({
  selector: 'demo-card-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDemoExample1Component {
  public readonly largeCards: Partial<Case>[] = [
    {
      title: 'Basic card',
      description: "It's just a card",
    },
    {
      title: 'Large disabled',
      description: 'A large card in disabled state',
      disabled: true,
    },
    {
      title: 'Large clickable',
      description: 'A large card that you can click on',
      clickable: true,
    },
    {
      title:
        'A large card with a very long header that can take up two lines, and in case of overflow will be hidden behind a colon',
      description: 'The description can also be very long and hidden behind a colon',
    },
  ];
}
