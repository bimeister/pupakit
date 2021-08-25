import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

@Component({
  selector: 'demo-search-field-demo',
  templateUrl: './search-field-demo.component.html',
  styleUrls: ['./search-field-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldDemoComponent {
  public readonly kindOptions: RadioOption[] = [
    {
      caption: 'Solid',
      value: 'solid'
    },
    {
      caption: 'Outlined',
      value: 'outlined'
    }
  ];
}
