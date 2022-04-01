import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_EXAMPLES_URL: string = 'floating-card-demo/examples';

@Component({
  selector: 'demo-floating-card',
  templateUrl: './floating-card-demo.component.html',
  styleUrls: ['./floating-card-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class FloatingCardDemoComponent {
  public ratio: number = 3;

  public readonly floatingCardExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLES_URL}/demo-floating-card-example/demo-floating-card-example.component.html`,
    CSS: `${BASE_EXAMPLES_URL}/demo-floating-card-example/demo-floating-card-example.component.scss`,
  };

  public readonly floatingCardWithCustomResetTypeExample: Record<string, string> = {
    HTML: `${BASE_EXAMPLES_URL}/demo-floating-card-with-custom-reset-type-example/demo-floating-card-with-custom-reset-type-example.component.html`,
    CSS: `${BASE_EXAMPLES_URL}/demo-floating-card-with-custom-reset-type-example/demo-floating-card-with-custom-reset-type-example.component.scss`,
  };
}
