import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-chip-button',
  templateUrl: './chip-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipButtonDemoComponent {}
