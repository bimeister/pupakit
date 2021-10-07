import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { InfoBlockExample1Component } from './examples/example-1/example-1.component';
import { InfoBlockDemoRoutingModule } from './info-block-demo-routing.module';
import { InfoBlockDemoComponent } from './info-block-demo.component';

@NgModule({
  declarations: [InfoBlockDemoComponent, InfoBlockExample1Component],
  imports: [DemoSharedModule, InfoBlockDemoRoutingModule]
})
export class InfoBlockDemoModule {}
