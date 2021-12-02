import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconButtonDemoRoutingModule } from './icon-button-demo-routing.module';
import { IconButtonDemoComponent } from './icon-button-demo.component';

@NgModule({
  declarations: [IconButtonDemoComponent],
  imports: [DemoSharedModule, IconButtonDemoRoutingModule],
})
export class IconButtonDemoModule {}
