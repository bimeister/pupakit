import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DividerDemoRoutingModule } from './divider-demo-routing.module';
import { DividerDemoComponent } from './divider-demo.component';
import { BasicDividerExampleComponent } from './examples/basic-example/basic-example.component';

@NgModule({
  declarations: [DividerDemoComponent, BasicDividerExampleComponent],
  imports: [DemoSharedModule, DividerDemoRoutingModule],
})
export class DividerDemoModule {}
