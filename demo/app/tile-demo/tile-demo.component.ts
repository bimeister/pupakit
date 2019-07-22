import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-loader',
  styleUrls: ['../demo.scss'],
  templateUrl: './tile-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileDemoComponent {
}
