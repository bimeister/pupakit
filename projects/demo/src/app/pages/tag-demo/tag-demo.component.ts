import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'tag-demo/examples';

@Component({
  selector: 'pupa-tag-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDemoComponent {
  public readonly boldFormControl: FormControl = new FormControl(true);

  public readonly colorOptions: PropsOption[] = [
    { caption: 'Opacity', value: 'opacity', isDefault: true },
    { caption: 'Primary', value: 'primary' },
    { caption: 'Success', value: 'success' },
    { caption: 'Danger', value: 'danger' },
    { caption: 'Warning', value: 'warning' },
    { caption: 'Selected', value: 'selected' },
    { caption: 'Custom', value: 'custom' },
  ];

  public readonly sizeOptions: PropsOption[] = [
    { caption: 'Medium', value: 'medium', isDefault: true },
    { caption: 'Small', value: 'small' },
  ];

  public readonly customCssVariables: string = `
--pupa-tag_background-color
--pupa-tag_background-color-hover
--pupa-tag_background-color-active
--pupa-tag_action_border-color
`;

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

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/example-6.component.scss`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/example-7.component.scss`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-8/example-8.component.scss`,
  };

  public readonly example9Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-9/example-9.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-9/example-9.component.scss`,
  };
}
