import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'code-demo/examples';

@Component({
  selector: 'demo-code-example-2',
  templateUrl: './example-2.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeExample2Component {
  public readonly simpleCode: string = '<div>here is simple code!</div>';

  public readonly example1TsPath: string = `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`;

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TypeScript: this.example1TsPath,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };
}
