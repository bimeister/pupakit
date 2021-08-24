import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { default as example1Ts } from '!!raw-loader!./examples/example-1/example-1.component';

@Component({
  selector: 'demo-adaptive-demo',
  templateUrl: './adaptive-demo.component.html',
  styleUrls: ['./adaptive-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdaptiveDemoComponent {
  public readonly code: string = example1Ts;
}
