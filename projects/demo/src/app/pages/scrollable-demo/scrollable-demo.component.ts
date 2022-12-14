import { Component } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'scrollable-demo/examples';

@Component({
  selector: 'demo-scrollable-demo',
  templateUrl: './scrollable-demo.component.html',
  styleUrls: ['./scrollable-demo.component.scss'],
})
export class ScrollableDemoComponent {
  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];
  public readonly positionOptions: PropsOption[] = [
    {
      caption: 'Internal',
      value: 'internal',
    },
    {
      caption: 'External',
      value: 'external',
    },
  ];
  public readonly scrollDragModeOptions: PropsOption[] = [
    {
      caption: 'None',
      value: 'null',
      isDefault: true,
    },
    {
      caption: 'Vertical',
      value: 'vertical',
    },
    {
      caption: 'Horizontal',
      value: 'horizontal',
    },
    {
      caption: 'All',
      value: 'all',
    },
  ];
  public readonly scrollVisibilityModeOptions: PropsOption[] = [
    {
      caption: 'always',
      value: 'always',
    },
    {
      caption: 'onscroll',
      value: 'onscroll',
    },
  ];
  public readonly invisibleScrollbarsOptions: PropsOption[] = [
    {
      caption: 'Vertical',
      value: 'vertical',
    },
    {
      caption: 'Horizontal',
      value: 'horizontal',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-4/example-4.component.ts`,
  };
}
