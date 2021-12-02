import { NgModule } from '@angular/core';
import { SidebarContentComponent } from './sidebar-content/sidebar-content.component';
import { DemoSharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SidebarContentComponent],
  imports: [DemoSharedModule, RouterModule],
  exports: [SidebarContentComponent],
})
export class SidebarModule {}
