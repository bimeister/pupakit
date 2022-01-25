import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-badge-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeExample5Component {}
