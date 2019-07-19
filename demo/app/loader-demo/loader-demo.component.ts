import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-loader',
  styleUrls: ['../demo.scss'],
  templateUrl: './loader-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDemoComponent {
  public combos: any[] = combos({
    size: ['32px', '16px', '14px']
  });
}
