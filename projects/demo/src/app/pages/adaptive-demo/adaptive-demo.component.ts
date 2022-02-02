import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'adaptive-demo/examples';

@Component({
  selector: 'demo-adaptive-demo',
  templateUrl: './adaptive-demo.component.html',
  styleUrls: ['./adaptive-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdaptiveDemoComponent {
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

  public readonly example8CalcBetweenScssPath: string = `${BASE_REQUEST_PATH}/example-8/calc-between.example.scss`;
  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-8/example-8.component.scss`,
  };

  public readonly example9Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-9/example-9.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-9/example-9.component.scss`,
  };
}
