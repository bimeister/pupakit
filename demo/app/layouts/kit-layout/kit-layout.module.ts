import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DemoSharedModule } from '../../shared/shared.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { KitLayoutComponent } from './kit-layout.component';
import { SidebarModule } from '../../components/sidebar/sidebar.module';

@NgModule({
  declarations: [KitLayoutComponent],
  imports: [DemoSharedModule, RouterModule, NavbarModule, SidebarModule]
})
export class KitLayoutModule {}
