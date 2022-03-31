import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Nullable } from '@bimeister/utilities';

interface PropertiesMap {
  [elementName: string]: { name: string; desc: string; type: string; decorator?: Nullable<'input' | 'output'> }[];
}

@Component({
  selector: 'demo-spinner-demo',
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  public readonly activeTabName$: Subject<string> = new Subject<string>();
  public readonly size: string = '32px';

  public readonly propertiesMap: PropertiesMap = {
    'Plain spinner': [{ name: 'size', desc: 'Set width and height of spinner', decorator: 'input', type: 'number' }],
    'Bagel spinner': [{ name: 'size', desc: 'Set width and height of spinner', decorator: 'input', type: 'number' }],
    Loader: [],
  };
}
