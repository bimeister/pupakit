import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LabelDemoRoutingModule } from './label-demo-routing.module';
import { LabelDemoComponent } from './label-demo.component';
import { LabelDemoBasicExampleComponent } from './examples/label-demo-basic-example/label-demo-basic-example.component';
import { LabelDemoExampleSizeComponent } from './examples/label-demo-example-size/label-demo-example-size.component';

@NgModule({
  declarations: [LabelDemoComponent, LabelDemoBasicExampleComponent, LabelDemoExampleSizeComponent],
  imports: [DemoSharedModule, LabelDemoRoutingModule],
})
export class LabelDemoModule {}
