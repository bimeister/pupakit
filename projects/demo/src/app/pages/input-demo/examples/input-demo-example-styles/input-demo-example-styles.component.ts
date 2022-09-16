import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-styles',
  templateUrl: './input-demo-example-styles.component.html',
  styleUrls: ['./input-demo-example-styles.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleStylesComponent {
  public readonly defaultStyleControl: FormControl = new FormControl('Default');
  public readonly inlineStyleControl: FormControl = new FormControl('Inline');
  public readonly boldStyleControl: FormControl = new FormControl('Bold');
  public readonly inlineBoldStyleControl: FormControl = new FormControl('Inline and bold');
}
