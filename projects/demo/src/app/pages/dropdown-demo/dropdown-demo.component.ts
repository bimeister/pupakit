import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'dropdown-demo/examples';

@Component({
  selector: 'demo-dropdown',
  styleUrls: ['../demo.scss', './dropdown-demo.component.scss'],
  templateUrl: './dropdown-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/dropdown-demo-example-1/dropdown-demo-example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/dropdown-demo-example-1/dropdown-demo-example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/dropdown-demo-example-1/dropdown-demo-example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/dropdown-demo-example-2/dropdown-demo-example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/dropdown-demo-example-2/dropdown-demo-example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/dropdown-demo-example-2/dropdown-demo-example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/dropdown-demo-example-3/dropdown-demo-example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/dropdown-demo-example-3/dropdown-demo-example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/dropdown-demo-example-3/dropdown-demo-example-3.component.ts`,
  };

  public readonly widthTypeOptions: PropsOption[] = [
    {
      caption: 'auto',
      value: 'auto',
      isDefault: true,
    },
    {
      caption: 'by-trigger',
      value: 'by-trigger',
    },
  ];

  public readonly horizontalPositionOptions: PropsOption[] = [
    {
      caption: 'start',
      value: 'start',
      isDefault: true,
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

  public readonly verticalPositionOptions: PropsOption[] = [
    {
      caption: 'bottom',
      value: 'bottom',
      isDefault: true,
    },
    {
      caption: 'top',
      value: 'top',
    },
  ];
}
