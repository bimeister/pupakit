import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-adaptive-example-7',
  templateUrl: './example-7.component.html',
  styleUrls: ['./example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdaptiveExample7Component {}
