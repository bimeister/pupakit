import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { DemoSharedModule } from '../../../shared/shared.module';
import { MenuToggleComponent } from './components/menu-toggle/menu-toggle.component';
import { GridToggleComponent } from './components/grid-toggle/grid-toggle.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarDrawerContentContainerComponent } from './components/sidebar-drawer-content-container/sidebar-drawer-content-container.component';
import { SidebarModule } from '../sidebar/sidebar.module';

@NgModule({
  declarations: [
    NavbarComponent,
    ThemeToggleComponent,
    MenuToggleComponent,
    GridToggleComponent,
    SidebarDrawerContentContainerComponent,
  ],
  exports: [NavbarComponent],
  imports: [DemoSharedModule, RouterModule, FormsModule, SidebarModule],
})
export class NavbarModule {}
