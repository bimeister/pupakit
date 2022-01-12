import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-floating-card',
  templateUrl: './floating-card-demo.component.html',
  styleUrls: ['./floating-card-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class FloatingCardDemoComponent {
  public readonly formControl: FormControl = new FormControl(2);
}
