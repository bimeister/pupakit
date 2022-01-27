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
// 'green' | 'red' | 'yellow' | 'primary' | 'default'
export class TagDemoComponent {
  public readonly boldFormControl: FormControl = new FormControl(true);

  public readonly colorOptions: PropsOption[] = [
    { caption: 'Default', value: 'default', isDefault: true },
    { caption: 'Primary', value: 'primary' },
    { caption: 'Green', value: 'green' },
    { caption: 'Red', value: 'red' },
    { caption: 'Yellow', value: 'yellow' },
  ];

  public readonly sizeOptions: PropsOption[] = [
    { caption: 'Medium', value: 'medium', isDefault: true },
    { caption: 'Small', value: 'small' },
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
