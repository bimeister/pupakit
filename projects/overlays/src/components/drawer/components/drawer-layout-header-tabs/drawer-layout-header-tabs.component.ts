import { ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { DrawerHeaderTabsActionsDirective } from '../../directives/drawer-header-tabs-actions.directive';

@Component({
  selector: 'pupa-drawer-layout-header-tabs',
  templateUrl: './drawer-layout-header-tabs.component.html',
  styleUrls: ['./drawer-layout-header-tabs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutHeaderTabsComponent {
  @ContentChild(DrawerHeaderTabsActionsDirective)
  public readonly drawerHeaderTabsActions: DrawerHeaderTabsActionsDirective;
}
