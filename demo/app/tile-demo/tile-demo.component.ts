import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-loader',
  styleUrls: ['./tile-demo.component.scss'],
  templateUrl: './tile-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileDemoComponent {
  public readonly combos: any[] = combos({
    columns: ['1', '11', '12', '10', '2', '3', '9', '8', '4', '5', '7', '6']
  });
}
