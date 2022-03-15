import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'radio-button-demo/examples';

@Component({
  selector: 'demo-button',
  styleUrls: ['./radio-button-demo.component.scss'],
  templateUrl: './radio-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonDemoComponent {
  public formControl: FormControl = new FormControl(1);

  public readonly directionOptions: PropsOption[] = [
    {
      caption: 'row',
      value: 'row',
      isDefault: true,
    },
    {
      caption: 'column',
      value: 'column',
    },
  ];

  public readonly labelSizeOptions: PropsOption[] = [
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
