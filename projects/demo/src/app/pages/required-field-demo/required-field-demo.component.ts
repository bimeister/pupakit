import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const BASE_REQUEST_PATH: string = 'required-field-demo/examples';

@Component({
  selector: 'demo-required-field',
  templateUrl: './required-field-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RequiredFieldDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };
}
