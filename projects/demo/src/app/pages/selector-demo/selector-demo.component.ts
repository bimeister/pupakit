import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select',
  styleUrls: ['./selector-demo.component.scss'],
  templateUrl: './selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorDemoComponent {
  public readonly formControl: FormControl = new FormControl(['mon', 'thu', 'wed', 'fri']);
}
