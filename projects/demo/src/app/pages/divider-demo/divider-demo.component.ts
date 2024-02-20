import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'divider-demo/examples';

@Component({
  selector: 'demo-divider',
  templateUrl: './divider-demo.component.html',
  styleUrls: ['./divider-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DividerDemoComponent {
  public readonly orientationOptions: PropsOption[] = [
    {
      caption: 'horizontal',
      value: 'horizontal',
      isDefault: true,
    },
    {
      caption: 'vertical',
      value: 'vertical',
    },
  ];

  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.scss`,
  };
}
