import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'callout-demo/examples';

@Component({
  selector: 'demo-callout-demo',
  templateUrl: './callout-demo.component.html',
  styleUrls: ['./callout-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };
  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
  };

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'Info',
      value: 'info',
      isDefault: true,
    },
    {
      caption: 'Success',
      value: 'success',
    },
    {
      caption: 'Warning',
      value: 'warning',
    },
    {
      caption: 'Danger',
      value: 'danger',
    },
  ];
}
