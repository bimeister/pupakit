import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-switcher',
  templateUrl: './switcher-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitcherDemoComponent {}
