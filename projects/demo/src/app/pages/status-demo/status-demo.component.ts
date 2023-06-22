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
    {
      caption: 'Neutral',
      value: 'neutral',
    },
    {
      caption: 'Custom',
      value: 'custom',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    { caption: 'Line', value: 'line', isDefault: true },
    { caption: 'Dot', value: 'dot' },
    { caption: 'Square', value: 'square' },
  ];

  public readonly markerPositionOptions: PropsOption[] = [
    { caption: 'Left', value: 'left', isDefault: true },
    { caption: 'Right', value: 'right' },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
  };
}
