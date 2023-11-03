import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'search-field-demo/examples';

@Component({
  selector: 'demo-search-field-demo',
  templateUrl: './search-field-demo.component.html',
  styleUrls: ['./search-field-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldDemoComponent {
  public readonly formControl: FormControl<string> = new FormControl<string>('');
  public readonly placeholderControl: FormControl<string> = new FormControl<string>('Placeholder');
  public readonly maxLengthControl: FormControl<number | null> = new FormControl<number | null>(null);

  public readonly collapseDirectionOptions: PropsOption[] = [
    {
      caption: 'To Left',
      value: 'to-left',
      isDefault: true,
    },
    {
      caption: 'To Right',
      value: 'to-right',
    },
  ];

  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/search-field-demo-example-basic/search-field-demo-example-basic.component.html`,
    TS: `${BASE_REQUEST_PATH}/search-field-demo-example-basic/search-field-demo-example-basic.component.ts`,
  };

  public readonly collapsibleExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/search-field-demo-example-collapsible/search-field-demo-example-collapsible.component.html`,
    TS: `${BASE_REQUEST_PATH}/search-field-demo-example-collapsible/search-field-demo-example-collapsible.component.ts`,
  };

  public readonly actionExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/search-field-demo-example-action/search-field-demo-example-action.component.html`,
    TS: `${BASE_REQUEST_PATH}/search-field-demo-example-action/search-field-demo-example-action.component.ts`,
  };
}
