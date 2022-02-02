import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-tabs-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsExample2Component {
  public readonly control1: FormControl = new FormControl('1');
  public readonly control2: FormControl = new FormControl('2');
}
