import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-layout-header-tabs',
  templateUrl: './drawer-layout-header-tabs.component.html',
  styleUrls: ['./drawer-layout-header-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutHeaderTabsComponent {}
