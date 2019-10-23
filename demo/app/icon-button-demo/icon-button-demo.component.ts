import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-icon-button-demo',
  templateUrl: './icon-button-demo.component.html',
  styleUrls: ['./icon-button-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonDemoComponent {
  public readonly combos: any[] = combos({
    color: ['dark', 'light'],
    active: [true, false],
    disabled: [true, false],
    size: ['small', 'small-to-medium', 'medium', 'large'],
    isFloat: [true, false]
  });
}
