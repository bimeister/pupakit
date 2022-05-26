import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_EXAMPLES_URL: string = 'form-layout-demo/examples';

@Component({
  selector: 'demo-form-layout-demo',
  templateUrl: './form-layout-demo.component.html',
  styleUrls: ['./form-layout-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class FormLayoutDemoComponent {
  public readonly baseExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLES_URL}/base-example/base-example.component.html`,
  };
}
