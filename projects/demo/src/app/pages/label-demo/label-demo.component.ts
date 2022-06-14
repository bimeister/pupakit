import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'label-demo/examples';

@Component({
  selector: 'demo-label',
  styleUrls: ['label-demo.component.scss'],
  templateUrl: './label-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelDemoComponent {
  public readonly buttonIconFormControl: FormControl = new FormControl('app-info');

  public readonly textFormControl: FormControl = new FormControl('Label Text');

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

  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/label-demo-basic-example/label-demo-basic-example.component.html`,
  };
  public readonly sizeExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/label-demo-example-size/label-demo-example-size.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/label-demo-example-size/label-demo-example-size.component.scss`,
  };
}
