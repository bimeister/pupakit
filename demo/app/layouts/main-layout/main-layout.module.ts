import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MainLayoutComponent } from './main-layout.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { DemoSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [DemoSharedModule, RouterModule, NavbarModule]
})
export class MainLayoutModule {}
