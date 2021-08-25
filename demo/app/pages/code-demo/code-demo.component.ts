import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { default as example2Ts } from '!!raw-loader!./examples/example-2/example-2.component';
import { default as example2Html } from '!!raw-loader!./examples/example-2/example-2.component.html';

@Component({
  selector: 'demo-code-demo',
  templateUrl: './code-demo.component.html',
  styleUrls: ['./code-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeDemoComponent {
  public readonly example2Content: Record<string, string> = {
    HTML: example2Html,
    TypeScript: example2Ts
  };
}
