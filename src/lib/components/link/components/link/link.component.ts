import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[pupaLink], button[pupaLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  @Input() public icon: string;
}
