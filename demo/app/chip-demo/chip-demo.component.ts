import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-chip',
  styleUrls: ['../demo.scss'],
  templateUrl: './chip-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipDemoComponent {}
