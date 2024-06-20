import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'stepper-demo/examples';

@Component({
  selector: 'demo-stepper-demo',
  templateUrl: './stepper-demo.component.html',
  styleUrls: ['./stepper-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperDemoComponent {
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
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
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
    TS: `${BASE_REQUEST_PATH}/example-6/example-6.component.ts`,
  };
}
