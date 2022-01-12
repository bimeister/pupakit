import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'status-demo/examples';

@Component({
  selector: 'demo-status',
  templateUrl: './status-demo.component.html',
  styleUrls: ['./status-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class StatusDemoComponent {
  public readonly colorOptions: PropsOption[] = [
    {
      caption: 'Primary',
      value: 'primary',
    },
    {
      caption: 'Warning',
      value: 'warning',
    },
    {
      caption: 'Danger',
      value: 'danger',
    },
    {
      caption: 'Success',
      value: 'success',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };
}
