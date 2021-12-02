import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

const BASE_REQUEST_PATH: string = 'switcher-demo/examples';

@Component({
  selector: 'demo-switcher',
  templateUrl: './switcher-demo.component.html',
  styleUrls: ['./switcher-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class SwitcherDemoComponent {
  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };
}
