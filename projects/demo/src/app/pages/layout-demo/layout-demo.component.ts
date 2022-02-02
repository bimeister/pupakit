import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-overlay',
  styleUrls: ['../demo.scss', './layout-demo.component.scss'],
  templateUrl: './layout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDemoComponent {}
