import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-adaptive-demo',
  templateUrl: './adaptive-demo.component.html',
  styleUrls: ['./adaptive-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdaptiveDemoComponent {}
