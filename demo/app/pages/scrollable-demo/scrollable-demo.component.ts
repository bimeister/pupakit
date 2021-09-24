import { Component } from '@angular/core';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

const BASE_REQUEST_PATH: string = 'scrollsble-demo/examples';

@Component({
  selector: 'demo-scrollable-demo',
  templateUrl: './scrollable-demo.component.html',
  styleUrls: ['./scrollable-demo.component.scss']
})
export class ScrollableDemoComponent {
  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Large',
      value: 'large'
    },
    {
      caption: 'Small',
      value: 'small'
    }
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`
  };
}
