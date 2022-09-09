import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { IconDemoComponent } from './icon-demo.component';
import { IconExample1Component } from './examples/example-1/example-1.component';
import { IconExample2Component } from './examples/example-2/example-2.component';
import { IconDemoRoutingModule } from './icon-demo-routing.module';

@NgModule({
  declarations: [IconDemoComponent, IconExample1Component, IconExample2Component],
  imports: [DemoSharedModule, IconDemoRoutingModule],
})
export class IconDemoModule {}
