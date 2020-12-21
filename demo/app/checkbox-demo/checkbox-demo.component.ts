import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-checkbox',
  templateUrl: './checkbox-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxDemoComponent {}
