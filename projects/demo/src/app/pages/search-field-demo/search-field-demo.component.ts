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
  public readonly formControl: FormControl = new FormControl('');
  public readonly placeholderControl: FormControl = new FormControl('Placeholder');

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

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };
}
