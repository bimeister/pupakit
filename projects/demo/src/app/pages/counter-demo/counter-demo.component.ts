import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'counter-demo/examples';

@Component({
  selector: 'demo-counter-demo',
  templateUrl: './counter-demo.component.html',
  styleUrls: ['./counter-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterDemoComponent {
  public readonly countFormControl: FormControl = new FormControl(1);
  public readonly maxCountFormControl: FormControl = new FormControl(99);

  public readonly colorOptions: PropsOption[] = [
    {
      caption: 'Neutral',
      value: 'neutral',
      isDefault: true,
    },
    {
      caption: 'Primary',
      value: 'primary',
    },
    {
      caption: 'Danger',
      value: 'danger',
    },
    {
      caption: 'Warning',
      value: 'warning',
    },
    {
      caption: 'Success',
      value: 'success',
    },
  ];

  public readonly modeOptions: PropsOption[] = [
    {
      caption: 'Default',
      value: 'default',
      isDefault: true,
    },
    {
      caption: 'Full',
      value: 'full',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };
}
