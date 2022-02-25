import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { DemoSharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SidebarLinkDirective } from '../../directives/sidebar-scroll/sidebar-link.directive';
import { SidebarScrollService } from '../../services/sidebar-scroll.service';

@NgModule({
  declarations: [SidebarComponent, SidebarLinkDirective],
  imports: [DemoSharedModule, RouterModule],
  exports: [SidebarComponent],
  providers: [SidebarScrollService],
})
export class SidebarModule {}
