import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LabelDemoRoutingModule } from './label-demo-routing.module';
import { LabelDemoComponent } from './label-demo.component';

@NgModule({
  declarations: [LabelDemoComponent],
  imports: [DemoSharedModule, LabelDemoRoutingModule]
})
export class LabelDemoModule {}
