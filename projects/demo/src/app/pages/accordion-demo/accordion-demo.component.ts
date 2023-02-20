import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

const BASE_REQUEST_PATH: string = 'accordion-demo/examples';

@Component({
  selector: 'demo-card',
  templateUrl: './accordion-demo.component.html',
  styleUrls: ['./accordion-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionDemoComponent {
  public readonly expandedFormControl: FormControl = new FormControl(false);

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-6/example-6.component.scss`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-7/example-7.component.scss`,
  };
}
