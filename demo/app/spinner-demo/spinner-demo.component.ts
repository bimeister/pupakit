import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-spinner-demo',
  styleUrls: ['../demo.scss'],
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerDemoComponent {
  public readonly combos: any[] = combos({
    size: ['32px', '16px', '14px']
  });
}
