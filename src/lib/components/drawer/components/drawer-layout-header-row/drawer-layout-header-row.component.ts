import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

type Types = 'top' | 'middle' | 'bottom';

@Component({
  selector: 'pupa-drawer-layout-header-row',
  templateUrl: './drawer-layout-header-row.component.html',
  styleUrls: ['./drawer-layout-header-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutHeaderRowComponent {
  @Input() public type: Types = 'middle';
}
