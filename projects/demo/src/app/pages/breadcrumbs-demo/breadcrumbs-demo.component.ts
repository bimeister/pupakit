import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'breadcrumbs-demo/examples';

@Component({
  selector: 'demo-breadcrumbs-demo',
  templateUrl: './breadcrumbs-demo.component.html',
  styleUrls: ['./breadcrumbs-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsDemoComponent {
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
}
