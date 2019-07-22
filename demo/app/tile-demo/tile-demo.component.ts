import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-loader',
  styleUrls: ['./tile-demo.component.scss'],
  templateUrl: './tile-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileDemoComponent {}
