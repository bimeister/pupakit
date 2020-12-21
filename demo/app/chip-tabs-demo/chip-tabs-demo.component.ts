import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-chip-tabs-demo',
  templateUrl: './chip-tabs-demo.component.html',
  styleUrls: ['./chip-tabs-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsDemoComponent {}
