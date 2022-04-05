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

  public readonly sizeOptions: PropsOption[] = [
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
}
