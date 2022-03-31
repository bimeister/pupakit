import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Nullable } from '@bimeister/utilities';

interface PropertiesMap {
  [elementName: string]: { name: string; desc: string; type: string; decorator?: Nullable<'input' | 'output'> }[];
}

const BASE_EXAMPLE_URL: string = 'spinner-demo/examples';

@Component({
  selector: 'demo-spinner',
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  public size: number = 50;

  public readonly plainSpinnerExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLE_URL}/demo-plain-spinner/demo-plain-spinner.component.html`,
  };
  public readonly bagelSpinnerExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLE_URL}/demo-bagel-spinner/demo-bagel-spinner.component.html`,
  };
  public readonly loaderExampleContent: Record<string, string> = {
    HTML: `${BASE_EXAMPLE_URL}/demo-loader/demo-loader.component.html`,
  };

  public readonly propertiesMap: PropertiesMap = {
    'Plain spinner': [{ name: 'size', desc: 'Set width and height of spinner', decorator: 'input', type: 'number' }],
    'Bagel spinner': [{ name: 'size', desc: 'Set width and height of spinner', decorator: 'input', type: 'number' }],
    Loader: [],
  };
}
