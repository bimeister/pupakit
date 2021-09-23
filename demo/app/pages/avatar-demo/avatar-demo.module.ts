import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { AvatarDemoRoutingModule } from './avatar-demo-routing.module';
import { AvatarDemoComponent } from './avatar-demo.component';

@NgModule({
  declarations: [AvatarDemoComponent],
  imports: [DemoSharedModule, AvatarDemoRoutingModule]
})
export class AvatarDemoModule {}
