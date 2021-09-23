import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconPageRoutingModule } from './icon-page-routing.module';
import { IconPageComponent } from './icon-page.component';

@NgModule({
  declarations: [IconPageComponent],
  imports: [DemoSharedModule, IconPageRoutingModule]
})
export class IconPageModule {}
