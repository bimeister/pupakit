import { ChangeDetectionStrategy, Component } from '@angular/core';

const BASE_REQUEST_PATH: string = 'button-group-demo/examples';

@Component({
  selector: 'demo-button-group-demo',
  templateUrl: './button-group-demo.component.html',
  styleUrls: ['./button-group-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-5/example-5.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
  };
}
