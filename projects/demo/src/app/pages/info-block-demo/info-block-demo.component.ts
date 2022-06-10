import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'info-block-demo/examples';

@Component({
  selector: 'demo-info-block-demo',
  templateUrl: './info-block-demo.component.html',
  styleUrls: ['./info-block-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBlockDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };

  public readonly variantOptions: PropsOption[] = [
    {
      caption: 'Info',
      value: 'info',
      isDefault: true,
    },
    {
      caption: 'Note',
      value: 'note',
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
      caption: 'Error',
      value: 'error',
    },
  ];
}
