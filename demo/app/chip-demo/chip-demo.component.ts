import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioOption } from '../example-viewer/radio-option';

@Component({
  selector: 'demo-chip',
  templateUrl: './chip-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipDemoComponent {
  public readonly colorOptions: RadioOption[] = [
    {
      caption: 'Normal',
      value: 'normal'
    },
    {
      caption: 'Normal light',
      value: 'normal-light'
    },
    {
      caption: 'Negative',
      value: 'negative'
    },
    {
      caption: 'Positive',
      value: 'positive'
    },
    {
      caption: 'Alert',
      value: 'alert'
    },
    {
      caption: 'Dark',
      value: 'dark'
    }
  ];
}
