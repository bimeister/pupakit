import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

@Component({
  selector: 'demo-spinner-demo',
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  public readonly size: string = '32px';

  public readonly typeOptions: PropsOption[] = [
    {
      caption: 'pupa-bagel-spinner',
      value: 'bagel-spinner',
    },
    {
      caption: 'pupa-spinner ',
      value: 'spinner',
    },
    {
      caption: 'pupa-loader',
      value: 'loader',
    },
  ];
}
