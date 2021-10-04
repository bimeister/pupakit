import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { MenuToggleComponent } from './components/menu-toggle/menu-toggle.component';

@NgModule({
  declarations: [NavbarComponent, ThemeToggleComponent, MenuToggleComponent],
  exports: [NavbarComponent],
  imports: [DemoSharedModule]
})
export class NavigationModule {}
