import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'icon-holder-demo/examples';

@Component({
  selector: 'pupa-icon-holder-demo',
  templateUrl: './icon-holder-demo.component.html',
  styleUrls: ['./icon-holder-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconHolderDemoComponent {
  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'large',
      value: 'large',
      isDefault: true,
    },
    {
      caption: 'medium',
      value: 'medium',
    },
    {
      caption: 'small',
      value: 'small',
    },
    {
      caption: 'extra-small',
      value: 'extra-small',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };
}
