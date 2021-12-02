import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TypographyPageRoutingModule } from './typography-page-routing.module';
import { TypographyPageComponent } from './typography-page.component';

@NgModule({
  declarations: [TypographyPageComponent],
  imports: [DemoSharedModule, TypographyPageRoutingModule],
})
export class TypographyPageModule {}
