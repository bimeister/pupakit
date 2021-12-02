import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { FloatingCardDemoRoutingModule } from './floating-card-demo-routing.module';
import { FloatingCardDemoComponent } from './floating-card-demo.component';

@NgModule({
  declarations: [FloatingCardDemoComponent],
  imports: [DemoSharedModule, FloatingCardDemoRoutingModule],
})
export class FloatingCardDemoModule {}
