import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { default as example1Ts } from '!!raw-loader!./../example-1/example-1.component';
import { default as example1Html } from '!!raw-loader!./../example-1/example-1.component.html';
import { default as example1Scss } from '!!raw-loader!./../example-1/example-1.component.scss';

@Component({
  selector: 'demo-code-example-2',
  templateUrl: './example-2.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeExample2Component {
  public readonly code: string = example1Ts;

  public readonly example1Content: Record<string, string> = {
    HTML: example1Html,
    TypeScript: example1Ts,
    SCSS: example1Scss
  };
}
