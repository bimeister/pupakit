import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-search-field-demo-example-collapsible',
  templateUrl: './search-field-demo-example-collapsible.component.html',
  styleUrls: ['./search-field-demo-example-collapsible.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldDemoExampleCollapsibleComponent {
  public readonly formControl: FormControl = new FormControl('');
}
