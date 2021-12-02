import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

@Component({
  selector: 'demo-spinner-demo',
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  public readonly size: string = '32px';
  public readonly typeOptions: RadioOption[] = [
    {
      caption: 'Simple',
      value: 'simple',
    },
    {
      caption: 'Bagel',
      value: 'bagel',
    },
    {
      caption: 'Scene loader',
      value: 'loader',
    },
  ];
}
