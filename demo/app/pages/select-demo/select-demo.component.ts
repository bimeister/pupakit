import { ChangeDetectionStrategy, Component } from '@angular/core';

const BASE_REQUEST_PATH: string = 'select-demo/examples';

@Component({
  selector: 'demo-select',
  styleUrls: ['./select-demo.component.scss'],
  templateUrl: './select-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-3/example-3.component.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-4/example-4.component.ts`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-5/example-5.component.ts`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-6/example-6.component.ts`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-one-selection/example-7/example-7.component.ts`,
  };

  public readonly example8Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-8/example-8.component.ts`,
  };

  public readonly example9Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-9/example-9.component.ts`,
  };

  public readonly example10Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-multi-selection/example-10/example-10.component.ts`,
  };

  public readonly example11Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-structure-composition/example-11/example-11.component.ts`,
  };

  public readonly example12Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-12/example-12.component.ts`,
  };

  public readonly example13Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-extra-cases/example-13/example-13.component.ts`,
  };

  public readonly example14Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-tree/example-14/example-14.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-tree/example-14/example-14.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-tree/example-14/example-14.component.ts`
  };

  public readonly example15Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-tree/example-15/example-15.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-tree/example-15/example-15.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-tree/example-15/example-15.component.ts`
  };

  public readonly example16Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-16/example-16.component.ts`
  };

  public readonly example17Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.scss`,
    TS: `${BASE_REQUEST_PATH}/select-demo-other/example-17/example-17.component.ts`
  };
}
