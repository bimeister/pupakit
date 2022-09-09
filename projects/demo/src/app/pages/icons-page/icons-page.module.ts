import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconsPageRoutingModule } from './icons-page-routing.module';
import { IconsPageComponent } from './icons-page.component';

@NgModule({
  declarations: [IconsPageComponent],
  imports: [DemoSharedModule, IconsPageRoutingModule],
})
export class IconsPageModule {}
