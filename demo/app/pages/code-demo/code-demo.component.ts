import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'code-demo/examples';

@Component({
  selector: 'demo-code-demo',
  templateUrl: './code-demo.component.html',
  styleUrls: ['./code-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeDemoComponent {
  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    TypeScript: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };
}
