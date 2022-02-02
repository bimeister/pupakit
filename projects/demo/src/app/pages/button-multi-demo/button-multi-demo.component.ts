import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { FormControl } from '@angular/forms';

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
  };

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
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'Primary',
      value: 'primary',
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
      caption: 'Border',
      value: 'border',
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
}
