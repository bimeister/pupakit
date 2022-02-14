import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-avatar-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarExample3Component {}
