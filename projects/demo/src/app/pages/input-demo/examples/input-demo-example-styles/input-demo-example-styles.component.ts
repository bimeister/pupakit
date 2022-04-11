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
  public readonly ghostStyleControl: FormControl = new FormControl('Ghost');
  public readonly boldStyleControl: FormControl = new FormControl('Bold');
  public readonly ghostBoldStyleControl: FormControl = new FormControl('Ghost and bold');
}
