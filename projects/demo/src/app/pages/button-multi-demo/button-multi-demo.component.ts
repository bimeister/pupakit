import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'button-multi-demo/examples';

@Component({
  selector: 'demo-button-multi',
  templateUrl: './button-multi-demo.component.html',
  styleUrls: ['./button-multi-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonMultiDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-4/example-4.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-5/example-5.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-6/example-6.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/example-6.component.scss`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-7/example-7.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/example-7.component.scss`,
  };

  public readonly buttonIconFormControl: FormControl = new FormControl('app-notification');
  public readonly tabIndexFormControl: FormControl = new FormControl('0');

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'large',
      value: 'large',
    },
    {
      caption: 'medium',
      value: 'medium',
      isDefault: true,
    },
    {
      caption: 'small',
      value: 'small',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'primary',
      value: 'primary',
      isDefault: true,
    },
    {
      caption: 'primary-secondary',
      value: 'primary-secondary',
    },
    {
      caption: 'primary-subtle',
      value: 'primary-subtle',
    },
    {
      caption: 'secondary',
      value: 'secondary',
    },
    {
      caption: 'border',
      value: 'border',
    },
    {
      caption: 'border-contrast',
      value: 'border-contrast',
    },
    {
      caption: 'subtle',
      value: 'subtle',
    },
    {
      caption: 'warning',
      value: 'warning',
    },
    {
      caption: 'danger',
      value: 'danger',
    },
    {
      caption: 'danger-subtle',
      value: 'danger-subtle',
    },
  ];

  public readonly typeOptions: PropsOption[] = [
    {
      caption: 'button',
      value: 'button',
      isDefault: true,
    },
    {
      caption: 'submit',
      value: 'submit',
    },
  ];

  public readonly iconPositionOptions: PropsOption[] = [
    {
      caption: 'Unset',
      value: null,
    },
    {
      caption: 'left',
      value: 'left',
    },
    {
      caption: 'right',
      value: 'right',
    },
  ];

  public readonly horizontalPositions: PropsOption[] = [
    {
      caption: 'start',
      value: 'start',
    },
    {
      caption: 'center',
      value: 'center',
    },
    {
      caption: 'end',
      value: 'end',
    },
  ];
}
