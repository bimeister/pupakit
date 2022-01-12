import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { DemoSharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SidebarComponent],
  imports: [DemoSharedModule, RouterModule],
  exports: [SidebarComponent],
})
export class SidebarModule {}
