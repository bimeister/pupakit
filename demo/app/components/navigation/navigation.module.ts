import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { MenuToggleComponent } from './components/menu-toggle/menu-toggle.component';
import { MenuDrawerComponent } from './components/menu-drawer/menu-drawer.component';

@NgModule({
  declarations: [NavbarComponent, ThemeToggleComponent, MenuToggleComponent, MenuDrawerComponent],
  exports: [NavbarComponent],
  imports: [DemoSharedModule]
})
export class NavigationModule {}
