import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-resizer-example',
  templateUrl: './resizer.component.html',
  styleUrls: ['./resizer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizerComponent {}
