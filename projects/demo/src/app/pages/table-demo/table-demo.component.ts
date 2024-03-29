import { Component } from '@angular/core';

const BASE_REQUEST_PATH: string = 'table-demo/examples';

@Component({
  selector: 'demo-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
})
export class TableDemoComponent {
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

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-5/example-5.component.ts`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/example-6.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-6/example-6.component.ts`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/example-7.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-7/example-7.component.ts`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-8/example-8.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-8/example-8.component.ts`,
  };

  public readonly example9Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-9/example-9.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-9/example-9.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-9/example-9.component.ts`,
  };

  public readonly example10Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-10/example-10.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-10/example-10.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-10/example-10.component.ts`,
  };
}
