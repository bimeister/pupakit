import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-sidebar-drawer-content-container',
  templateUrl: './sidebar-drawer-content-container.component.html',
  styleUrls: ['./sidebar-drawer-content-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarDrawerContentContainerComponent {}
