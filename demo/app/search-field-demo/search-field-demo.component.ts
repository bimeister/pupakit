import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-search-field-demo',
  templateUrl: './search-field-demo.component.html',
  styleUrls: ['./search-field-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldDemoComponent {
  public readonly combos: any[] = combos({
    kind: ['solid', 'outlined'],
    expandable: [true, false]
  });

  public log(...data: unknown[]): void {
    // tslint:disable-next-line: no-console
    console.log(...data);
  }
}
