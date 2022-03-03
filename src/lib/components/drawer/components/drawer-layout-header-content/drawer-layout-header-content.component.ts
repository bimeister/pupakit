import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

type Mode = 'normal' | 'buttons';

@Component({
  selector: 'pupa-drawer-layout-header-content',
  templateUrl: './drawer-layout-header-content.component.html',
  styleUrls: ['./drawer-layout-header-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutHeaderContentComponent {
  @Input() public mode: Mode = 'normal';
}
