import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'button-demo/examples';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonDemoComponent {
  public readonly buttonIconFormControl: FormControl = new FormControl('app-notification');

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
    {
      caption: 'Small',
      value: 'small',
    },
    {
      caption: 'Extra-Small',
      value: 'extra-small',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'Primary',
      value: 'primary',
    },
    {
      caption: 'Primary-secondary',
      value: 'primary-secondary',
    },
    {
      caption: 'Primary-subtle',
      value: 'primary-subtle',
    },
    {
      caption: 'Secondary',
      value: 'secondary',
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
      caption: 'Subtle',
      value: 'subtle',
    },
    {
      caption: 'Border',
      value: 'border',
    },
    {
      caption: 'Border Contrast',
      value: 'border-contrast',
    },
    {
      caption: 'Danger-subtle',
      value: 'danger-subtle',
    },
  ];

  public readonly iconPositionOptions: PropsOption[] = [
    {
      caption: 'Unset',
      value: null,
    },
    {
      caption: 'Left',
      value: 'left',
    },
    {
      caption: 'Right',
      value: 'right',
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

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
  };
}
