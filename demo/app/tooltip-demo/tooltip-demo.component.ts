import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-tooltip',
  styleUrls: ['../demo.scss'],
  templateUrl: './tooltip-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipDemoComponent {}
