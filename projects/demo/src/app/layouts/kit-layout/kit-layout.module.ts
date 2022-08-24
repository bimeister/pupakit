import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarModule } from '../../common/components/navbar/navbar.module';
import { SidebarModule } from '../../common/components/sidebar/sidebar.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { KitLayoutComponent } from './kit-layout.component';

@NgModule({
  declarations: [KitLayoutComponent],
  imports: [DemoSharedModule, RouterModule, NavbarModule, SidebarModule],
})
export class KitLayoutModule {}
