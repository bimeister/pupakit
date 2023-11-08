import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_EXAMPLES_URL: string = 'hotkey-demo/examples';

@Component({
  selector: 'demo-hotkey-demo',
  templateUrl: './hotkey-demo.component.html',
  styleUrls: ['./hotkey-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class HotkeyDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_EXAMPLES_URL}/example-1/example-1.component.html`,
    TS: `${BASE_EXAMPLES_URL}/example-1/example-1.component.ts`,
    SCSS: `${BASE_EXAMPLES_URL}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_EXAMPLES_URL}/example-2/example-2.component.html`,
    TS: `${BASE_EXAMPLES_URL}/example-2/example-2.component.ts`,
    SCSS: `${BASE_EXAMPLES_URL}/example-2/example-2.component.scss`,
  };
}
