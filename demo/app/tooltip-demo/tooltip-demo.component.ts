import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-tooltip',
  templateUrl: './tooltip-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipDemoComponent {}
