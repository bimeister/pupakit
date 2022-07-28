import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'button-icon-demo/examples';

@Component({
  selector: 'demo-button',
  templateUrl: './button-icon-demo.component.html',
  styleUrls: ['./button-icon-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonIconDemoComponent {
  public readonly buttonIconFormControl: FormControl = new FormControl('app-notification');
  public readonly tabIndexFormControl: FormControl = new FormControl('0');

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'xl',
      value: 'xl',
    },
    {
      caption: 'l',
      value: 'l',
      isDefault: true,
    },
    {
      caption: 'm',
      value: 'm',
    },
    {
      caption: 's',
      value: 's',
    },
    {
      caption: 'xs',
      value: 'xs',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'primary',
      value: 'primary',
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
      caption: 'success',
      value: 'success',
    },
    {
      caption: 'warning',
      value: 'warning',
    },
    {
      caption: 'danger',
      value: 'danger',
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
}
