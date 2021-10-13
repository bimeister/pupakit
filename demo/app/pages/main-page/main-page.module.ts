import { NgModule } from '@angular/core';

import { MainPageComponent } from './components/main-page/main-page.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { DemoSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MainPageComponent],
  imports: [DemoSharedModule, MainPageRoutingModule]
})
export class MainPageModule {}
